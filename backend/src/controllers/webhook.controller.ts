import { Request, Response } from 'express';
import { saveMessage } from '../services/message.service';
import { processMessageWithAI } from '../services/ai.service';
import { 
  sendWhatsAppMessage, 
  sendCursoOnlineInfo, 
  sendCursoSaludInfo, 
  sendCursoEneroInfo, 
  sendCursoIntensivoInfo 
} from '../services/whatsapp.service';
import { findOrCreateCustomer } from '../services/customer.service';
import { supabase } from '../config/supabase';

// Set para almacenar IDs de mensajes procesados recientemente
const processedMessageIds = new Set<string>();
// Tiempo de expiración para los IDs de mensajes (en milisegundos)
const MESSAGE_ID_EXPIRATION = 60 * 60 * 1000; // 1 hora

// Verificar webhook (para configuración inicial con WhatsApp Business API)
export const verifyWebhook = (req: Request, res: Response) => {
  try {
    console.log('Solicitud de verificación de webhook recibida:', req.query);
    
    // Obtener parámetros de verificación
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Verificar token
    const verifyToken = process.env.WHATSAPP_VERIFICATION_TOKEN;
    console.log('Token configurado:', verifyToken);
    console.log('Token recibido:', token);

    // Verificar que el token y modo sean correctos
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verificado exitosamente');
      res.status(200).send(challenge);
    } else {
      console.error('Verificación de webhook fallida. Mode:', mode, 'Token coincide:', token === verifyToken);
      res.sendStatus(403);
    }
  } catch (error) {
    console.error('Error en verificación de webhook:', error);
    res.sendStatus(500);
  }
};

/**
 * Verifica si el mensaje es una consulta sobre el curso en línea
 * 
 * @param message Mensaje a verificar
 * @returns true si el mensaje es sobre el curso en línea
 */
const isCursoOnlineQuery = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Palabras clave que indican interés en el curso en línea
  const keywords = [
    'curso en línea', 'curso online', 'curso virtual', 'curso a distancia',
    'clases en línea', 'clases online', 'clases virtuales', 'clases a distancia',
    'curso por zoom', 'curso remoto', 'curso desde casa'
  ];
  
  // Verificar si alguna palabra clave está presente en el mensaje
  return keywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Verifica si el mensaje es una consulta sobre el curso de Áreas de la Salud
 * 
 * @param message Mensaje a verificar
 * @returns true si el mensaje es sobre el curso de Áreas de la Salud
 */
const isCursoSaludQuery = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Palabras clave que indican interés en el curso de Áreas de la Salud
  const keywords = [
    'curso salud', 'curso de salud', 'curso área de salud', 'curso áreas de la salud',
    'curso medicina', 'curso odontología', 'curso enfermería', 'curso nutrición',
    'curso psicología', 'curso fisioterapia', 'curso octubre', 'curso 26 de octubre'
  ];
  
  // Verificar si alguna palabra clave está presente en el mensaje
  return keywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Verifica si el mensaje es una consulta sobre el curso de Enero
 * 
 * @param message Mensaje a verificar
 * @returns true si el mensaje es sobre el curso de Enero
 */
const isCursoEneroQuery = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Palabras clave que indican interés en el curso de Enero
  const keywords = [
    'curso enero', 'curso de enero', 'curso 18 de enero', 'curso todas las carreras',
    'curso general', 'curso completo', 'curso regular', 'curso normal'
  ];
  
  // Verificar si alguna palabra clave está presente en el mensaje
  return keywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Verifica si el mensaje es una consulta sobre el curso Intensivo
 * 
 * @param message Mensaje a verificar
 * @returns true si el mensaje es sobre el curso Intensivo
 */
const isCursoIntensivoQuery = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Palabras clave que indican interés en el curso Intensivo
  const keywords = [
    'curso intensivo', 'curso rápido', 'curso acelerado', 'curso corto',
    'curso marzo', 'curso de marzo', 'curso 2 de marzo', 'curso express'
  ];
  
  // Verificar si alguna palabra clave está presente en el mensaje
  return keywords.some(keyword => lowerMessage.includes(keyword));
};

// Recibir mensajes de WhatsApp
export const receiveMessage = async (req: Request, res: Response) => {
  try {
    // Enviar respuesta rápida para evitar timeout
    res.status(200).send('Evento recibido');
    
    console.log('Webhook recibido:', JSON.stringify(req.body, null, 2));

    // Verificar si es un mensaje de WhatsApp
    if (req.body.object === 'whatsapp_business_account') {
      // Procesar cada entrada
      for (const entry of req.body.entry) {
        // Procesar cada cambio en la entrada
        for (const change of entry.changes) {
          // Verificar que sea un mensaje
          if (
            change.field === 'messages' && 
            change.value && 
            change.value.messages && 
            change.value.messages.length > 0
          ) {
            // Extraer información del mensaje
            const message = change.value.messages[0];
            
            // Verificar que sea un mensaje de texto
            if (message.type !== 'text') {
              console.log('Mensaje no es de texto, ignorando');
              continue;
            }
            
            // Extraer datos del mensaje
            const messageId = message.id;
            
            // Verificar si el mensaje ya fue procesado
            if (processedMessageIds.has(messageId)) {
              console.log(`Mensaje ${messageId} ya fue procesado, ignorando duplicado`);
              continue;
            }
            
            // Agregar el ID del mensaje al set de mensajes procesados
            processedMessageIds.add(messageId);
            
            // Configurar la eliminación del ID después de un tiempo
            setTimeout(() => {
              processedMessageIds.delete(messageId);
            }, MESSAGE_ID_EXPIRATION);
            
            const phone = change.value.contacts[0].wa_id;
            const name = change.value.contacts[0].profile.name;
            const text = message.text.body;
            const timestamp = message.timestamp;
            
            console.log(`Mensaje recibido de ${name} (${phone}): ID ${messageId}`);
            console.log(`Contenido del mensaje: "${text}"`);
            
            // Crear un buffer de espera para dar tiempo al usuario de enviar más mensajes
            console.log(`Esperando 10 segundos antes de procesar el mensaje...`);
            
            // Usar setTimeout para esperar 10 segundos
            setTimeout(async () => {
              try {
                // Verificar nuevamente si el mensaje ya fue procesado (por si acaso)
                if (!processedMessageIds.has(messageId)) {
                  console.log(`Mensaje ${messageId} ya no está en la lista de procesamiento, posible duplicado tardío`);
                  return;
                }
                
                // Buscar o crear cliente en Airtable
                const customer = await findOrCreateCustomer(phone, name);
                console.log(`Cliente en Airtable: ${customer.id} (${customer.name})`);
                
                // Buscar cliente en Supabase
                const { data: existingCustomer, error: queryError } = await supabase
                  .from('customers')
                  .select('id')
                  .eq('airtable_id', customer.id)
                  .single();
                
                let supabaseCustomerId;
                
                if (queryError || !existingCustomer) {
                  console.log('Cliente no encontrado en Supabase, creando...');
                  // Crear el cliente en Supabase
                  const { data: newCustomer, error: insertError } = await supabase
                    .from('customers')
                    .insert([
                      {
                        airtable_id: customer.id,
                        phone: customer.phone,
                        name: customer.name,
                        email: customer.email || '',
                        status: customer.status,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                      }
                    ])
                    .select()
                    .single();
                  
                  if (insertError || !newCustomer) {
                    console.error('Error al crear cliente en Supabase:', insertError);
                    return; // No podemos procesar este mensaje
                  }
                  
                  supabaseCustomerId = newCustomer.id;
                } else {
                  supabaseCustomerId = existingCustomer.id;
                }
                
                console.log(`Cliente en Supabase: ${supabaseCustomerId}`);
                
                // Guardar el mensaje recibido
                await saveMessage({
                  messageId,
                  customerId: supabaseCustomerId, // Usar ID de Supabase, no de Airtable
                  direction: 'received',
                  content: text,
                  timestamp: new Date(parseInt(timestamp) * 1000),
                  status: 'delivered'
                });
                
                console.log('Mensaje guardado en Supabase');
                
                // Determinar el tipo de consulta y enviar la información correspondiente
                let messageIds: (string | null)[] = [];
                let cursoTipo = '';
                
                if (isCursoOnlineQuery(text)) {
                  console.log('Detectada consulta sobre curso en línea, enviando mensajes predeterminados');
                  messageIds = await sendCursoOnlineInfo(phone);
                  cursoTipo = 'en línea';
                } 
                else if (isCursoSaludQuery(text)) {
                  console.log('Detectada consulta sobre curso de Áreas de la Salud, enviando mensajes predeterminados');
                  messageIds = await sendCursoSaludInfo(phone);
                  cursoTipo = 'Áreas de la Salud';
                }
                else if (isCursoEneroQuery(text)) {
                  console.log('Detectada consulta sobre curso de Enero, enviando mensajes predeterminados');
                  messageIds = await sendCursoEneroInfo(phone);
                  cursoTipo = 'Enero';
                }
                else if (isCursoIntensivoQuery(text)) {
                  console.log('Detectada consulta sobre curso Intensivo, enviando mensajes predeterminados');
                  messageIds = await sendCursoIntensivoInfo(phone);
                  cursoTipo = 'Intensivo';
                }
                else {
                  // Si no es una consulta sobre cursos específicos, procesar con IA
                  const aiResponse = await processMessageWithAI(text, customer);
                  console.log(`Respuesta de IA: "${aiResponse}"`);
                  
                  // Enviar respuesta al cliente
                  const sentMessageId = await sendWhatsAppMessage(phone, aiResponse);
                  
                  // Guardar la respuesta enviada
                  if (sentMessageId) {
                    await saveMessage({
                      messageId: sentMessageId,
                      customerId: supabaseCustomerId, // Usar ID de Supabase, no de Airtable
                      direction: 'sent',
                      content: aiResponse,
                      timestamp: new Date(),
                      status: 'sent'
                    });
                    console.log('Respuesta enviada y guardada en Supabase');
                  }
                  
                  return; // Terminar aquí si se procesó con IA
                }
                
                // Si llegamos aquí, es porque se enviaron mensajes predeterminados
                // Guardar cada mensaje enviado en Supabase
                for (let i = 0; i < messageIds.length; i++) {
                  const sentMessageId = messageIds[i];
                  if (sentMessageId) {
                    await saveMessage({
                      messageId: sentMessageId,
                      customerId: supabaseCustomerId,
                      direction: 'sent',
                      content: `Información del curso ${cursoTipo} (parte ${i + 1})`,
                      timestamp: new Date(),
                      status: 'sent'
                    });
                  }
                }
                
                console.log(`Mensajes predeterminados sobre el curso ${cursoTipo} enviados y guardados en Supabase`);
                
              } catch (processingError) {
                console.error('Error al procesar mensajes:', processingError);
              }
            }, 10000); // Esperar 10 segundos
            
          }
        }
      }
    }
  } catch (error) {
    console.error('Error al procesar webhook:', error);
  }
}; 