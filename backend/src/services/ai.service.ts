import { openai } from '../config/openai';
import { Customer } from '../models/customer.model';
import { getMessagesByCustomerId } from './message.service';
import { supabase } from '../config/supabase';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { classifyIntent, retrieveKnowledge, determineCustomerType } from './intent.service';
import { findKnowledgeFile, parseKnowledgeFile, selectResponse, formatResponse } from '../utils/knowledge_base.utils';

// Función auxiliar para obtener el ID de Supabase de un cliente
async function getSupabaseCustomerId(airtableId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id')
      .eq('airtable_id', airtableId)
      .single();
    
    if (error || !data) {
      console.error('Error al buscar cliente en Supabase:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error al obtener ID de Supabase:', error);
    return null;
  }
}

// Procesar un mensaje con IA
export const processMessageWithAI = async (
  message: string,
  customer: Customer
): Promise<string> => {
  try {
    // Obtener el ID de Supabase correspondiente al ID de Airtable
    const supabaseCustomerId = await getSupabaseCustomerId(customer.id);
    
    if (!supabaseCustomerId) {
      throw new Error(`No se pudo encontrar el ID de Supabase para el cliente ${customer.id}`);
    }
    
    // Obtener historial de conversaciones para contexto
    const messagesHistory = await getMessagesByCustomerId(supabaseCustomerId);

    // Registrar todos los datos del cliente para depuración
    console.log("DATOS COMPLETOS DEL CLIENTE PARA IA:", JSON.stringify({
      id: customer.id,
      nombre: customer.name,
      email: customer.email,
      telefono: customer.phone,
      estatus: customer.status,
      ciudad: customer.city,
      genero: customer.gender,
      tipoExamen: customer.examType,
      aspiranteA: customer.aspirantTo,
      grupo: customer.group,
      intentos2024: customer.intentos2024,
      verificado: customer.verified,
      configurado: customer.configured
    }, null, 2));
    
    // 1. Clasificar la intención del mensaje
    const { intent, confidence } = await classifyIntent(message);
    console.log(`Intención identificada: ${intent} (confianza: ${confidence})`);
    
    // 2. Recuperar información relevante de la base de conocimiento
    const knowledgeInfo = await retrieveKnowledge(intent, message);
    console.log(`Información recuperada para intención ${intent}`);
    
    // 3. Identificar el tipo de cliente
    const customerType = determineCustomerType(customer);
    console.log(`Tipo de cliente identificado: ${customerType}`);
    
    // Determinar si hay información específica disponible
    const hasSpecificInfo = !!(
      customer.examType || 
      customer.aspirantTo || 
      customer.group || 
      customer.city || 
      customer.gender
    );
    
    // Preparar contexto para la IA con información detallada del usuario
    // y la información recuperada de la base de conocimiento
    const context = `
      Eres un asistente de WhatsApp para Centro Cívico que gestiona comunicaciones con estudiantes y aspirantes.
      
      PERFIL DEL CLIENTE:
      - Nombre: ${customer.name || 'No disponible'}
      - Teléfono: ${customer.phone || 'No disponible'}
      - Email: ${customer.email || 'No disponible'}
      - Estatus: ${customer.status || 'No disponible'}
      - Ciudad: ${customer.city || 'No disponible'}
      - Género: ${customer.gender || 'No disponible'}
      - Tipo de examen: ${customer.examType || 'No disponible'}
      - Aspirante a: ${customer.aspirantTo || 'No disponible'}
      - Grupo: ${customer.group || 'No disponible'}
      - Verificado: ${customer.verified ? 'Sí' : 'No'}
      - Configurado: ${customer.configured ? 'Sí' : 'No'}
      - Tipo de cliente: ${customerType}
      
      INTENCIÓN DETECTADA: ${intent} (confianza: ${confidence})
      
      BASE DE CONOCIMIENTO RELEVANTE:
      ${knowledgeInfo}
      
      REGLAS OBLIGATORIAS:
      1. NUNCA SALUDES con "Hola" o "Hola [Nombre]" a menos que sea el primer mensaje del usuario.
      2. NO repitas información del perfil del usuario a menos que sea directamente relevante para la pregunta.
      3. Sé conciso y directo en tus respuestas.
      4. Si el usuario pregunta "¿qué sabes sobre mí?", enumera todos sus datos.
      5. Si los datos específicos no están disponibles, PIDE esta información al usuario.
      6. Usa la información de la base de conocimiento para proporcionar respuestas precisas.
      7. Para negritas usa UN SOLO asterisco (*), no dos. Ejemplo: *texto en negrita*.
      8. Cuando el usuario pregunte sobre cursos disponibles, SOLO menciona los cursos que aparecen en la sección "Cursos Actualmente Disponibles para Inscripción" y que tengan el estado "Inscripciones Abiertas".
      9. Si no hay cursos con inscripciones abiertas, informa claramente que actualmente no hay cursos disponibles para inscripción.
      10. Si el usuario pregunta por un curso específico, verifica primero si está disponible para inscripción antes de recomendar inscribirse.
      11. Para cursos en progreso, indica claramente que las inscripciones están cerradas pero que pueden contactarnos para más información.

      ESTRUCTURA DE RESPUESTA:
      1. OMITE EL SALUDO a menos que sea el primer mensaje.
      2. Cuerpo de la respuesta (utilizando la información relevante).
      3. Cierre amigable con emoji.
      
      CONSULTA ACTUAL: "${message}"
    `;

    console.log("CONTEXTO ENVIADO A IA:", context);
    
    // Construir el historial de conversación para el modelo
    const conversationHistory: ChatCompletionMessageParam[] = messagesHistory
      .slice(-5) // Tomar los últimos 5 mensajes para no exceder contexto
      .map(msg => ({
        role: msg.direction === 'received' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
    
    // Determinar si es el primer mensaje
    const isFirstMessage = conversationHistory.length === 0;
    
    // Crear el prompt final
    const prompt: ChatCompletionMessageParam[] = [
      { role: 'system', content: context },
      ...conversationHistory,
      { role: 'user', content: message }
    ];
    
    // Obtener respuesta de OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const response = completion.choices[0].message.content || 'Lo siento, no pude procesar tu solicitud.';
    
    // Si es el primer mensaje y no hay saludo, añadir uno simple
    if (isFirstMessage && !response.toLowerCase().includes('hola') && customer.name) {
      return `¡Hola ${customer.name}! ${response}`;
    }
    
    return response;
  } catch (error) {
    console.error('Error al procesar mensaje con IA:', error);
    return 'Lo siento, estamos experimentando problemas técnicos. Intentaremos responder a tu mensaje lo antes posible.';
  }
}; 