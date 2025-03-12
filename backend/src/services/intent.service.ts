import { openai } from '../config/openai';
import fs from 'fs';
import path from 'path';

// Interfaz para la respuesta de clasificación
interface IntentClassification {
  intent: 'cursos' | 'examen_admision' | 'proceso_admision' | 'info_negocio' | 'carreras_uabc' | 'garantias' | 'pagos' | 'soporte_tecnico' | 'certificados' | 'testimonios' | 'contacto' | 'ubicaciones' | 'academico';
  confidence: number;
}

/**
 * Clasifica la intención del mensaje del usuario
 * 
 * @param message Mensaje del usuario a clasificar
 * @returns La clasificación de la intención con su nivel de confianza
 */
export const classifyIntent = async (message: string): Promise<IntentClassification> => {
  try {
    console.log(`Clasificando intención del mensaje: "${message}"`);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Eres un clasificador de intenciones para un sistema de WhatsApp en un centro educativo que ofrece cursos de preparación para exámenes de admisión a universidades.
          Tu tarea es clasificar el mensaje del usuario en una de las siguientes categorías:
          
          1. cursos: Preguntas sobre cursos disponibles, fechas, costos, modalidades, contenido de cursos.
          2. examen_admision: Preguntas específicas sobre el examen de admisión, su contenido, formato, consejos.
          3. proceso_admision: Preguntas sobre el proceso de admisión, documentos, fechas, requisitos, trámites.
          4. info_negocio: Preguntas sobre la empresa, historia, metodología, filosofía.
          5. carreras_uabc: Preguntas sobre carreras disponibles en UABC, perfiles profesionales.
          6. garantias: Preguntas sobre garantías de aprobación, políticas de reembolso.
          7. pagos: Preguntas sobre métodos de pago, planes, facilidades, facturación.
          8. soporte_tecnico: Problemas con la plataforma, acceso, simuladores, materiales.
          9. certificados: Preguntas sobre certificados, constancias, diplomas.
          10. testimonios: Solicitudes de testimonios, resultados, casos de éxito.
          11. contacto: Formas de contacto, teléfonos, emails, redes sociales.
          12. ubicaciones: Dirección física, cómo llegar, instalaciones.
          13. academico: Preguntas sobre técnicas de estudio, preparación, contenido académico.
          
          Debes responder con la categoría más adecuada y un nivel de confianza entre 0 y 1.
          `
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 50,
      temperature: 0.3,
    });
    
    const content = response.choices[0]?.message?.content || '';
    
    // Intentar extraer la intención y confianza del formato esperado
    let intent: string, confidence: number;
    
    // Verificar varios formatos posibles
    const jsonMatch = content.match(/\{.*\}/s);
    if (jsonMatch) {
      try {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        intent = jsonResponse.intent || jsonResponse.category || '';
        confidence = parseFloat(jsonResponse.confidence || '0') || 0.7;
      } catch (e) {
        console.warn('Error al parsear JSON de respuesta:', e);
        // Extraer de formato no JSON
        intent = extractIntent(content);
        confidence = extractConfidence(content);
      }
    } else {
      // Extraer de formato no JSON
      intent = extractIntent(content);
      confidence = extractConfidence(content);
    }
    
    // Validar la intención
    const validIntents = ['cursos', 'examen_admision', 'proceso_admision', 'info_negocio', 'carreras_uabc', 
                         'garantias', 'pagos', 'soporte_tecnico', 'certificados', 'testimonios', 
                         'contacto', 'ubicaciones', 'academico'];
    
    if (!validIntents.includes(intent)) {
      console.warn(`Intención no reconocida: ${intent}, usando "cursos" por defecto`);
      intent = 'cursos';
    }
    
    // Validar la confianza
    if (isNaN(confidence) || confidence < 0 || confidence > 1) {
      console.warn(`Confianza inválida: ${confidence}, usando 0.7 por defecto`);
      confidence = 0.7;
    }
    
    return {
      intent: intent as IntentClassification['intent'],
      confidence
    };
  } catch (error) {
    console.error('Error al clasificar intención:', error);
    // Devolver una intención por defecto en caso de error
    return {
      intent: 'cursos',
      confidence: 0.5
    };
  }
};

/**
 * Extrae la intención de una respuesta de texto
 */
function extractIntent(text: string): string {
  // Buscar patrones comunes donde podría estar la intención
  const intentMatches = text.match(/intent[:\s]+([a-z_]+)/i) || 
                        text.match(/categoría[:\s]+([a-z_]+)/i) ||
                        text.match(/categoria[:\s]+([a-z_]+)/i) ||
                        text.match(/category[:\s]+([a-z_]+)/i) ||
                        text.match(/^([a-z_]+)$/i) ||
                        text.match(/\b(cursos|examen_admision|proceso_admision|info_negocio|carreras_uabc|garantias|pagos|soporte_tecnico|certificados|testimonios|contacto|ubicaciones|academico)\b/i);
  
  return intentMatches ? intentMatches[1].toLowerCase() : 'cursos';
}

/**
 * Extrae el nivel de confianza de una respuesta de texto
 */
function extractConfidence(text: string): number {
  const confidenceMatches = text.match(/confianza[:\s]+(0\.\d+|1\.0|1)/i) ||
                           text.match(/confidence[:\s]+(0\.\d+|1\.0|1)/i) ||
                           text.match(/(0\.\d+|1\.0|1)/);
  
  return confidenceMatches ? parseFloat(confidenceMatches[1]) : 0.7;
}

/**
 * Retorna el directorio de conocimiento basado en la intención
 */
function getKnowledgeDirectory(intent: string): string {
  // Mapeo de intenciones a directorios
  const intentDirectoryMap: Record<string, string> = {
    'cursos': 'cursos',
    'examen_admision': 'admision_uabc',
    'proceso_admision': 'admision_uabc',
    'info_negocio': 'contacto',
    'carreras_uabc': 'admision_uabc',
    'garantias': 'garantias',
    'pagos': 'pagos',
    'soporte_tecnico': 'soporte_tecnico',
    'certificados': 'soporte_tecnico',
    'testimonios': 'testimonios',
    'contacto': 'contacto',
    'ubicaciones': 'contacto',
    'academico': 'academico'
  };
  
  return intentDirectoryMap[intent] || 'cursos';
}

/**
 * Recupera información de la base de conocimiento basada en la intención y la consulta
 * 
 * @param intent Intención clasificada
 * @param query Consulta original del usuario
 * @returns Información recuperada de la base de conocimiento
 */
export const retrieveKnowledge = async (intent: string, query: string): Promise<string> => {
  try {
    const knowledgeDir = path.join(__dirname, '..', 'knowledge_base', getKnowledgeDirectory(intent));
    
    // Verificar si el directorio existe
    if (!fs.existsSync(knowledgeDir)) {
      console.warn(`Directorio de conocimiento no encontrado: ${knowledgeDir}`);
      return "No se encontró información relevante.";
    }
    
    // Obtener todos los archivos Markdown en el directorio
    const files = fs.readdirSync(knowledgeDir).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      console.warn(`No se encontraron archivos Markdown en: ${knowledgeDir}`);
      return "No se encontró información relevante.";
    }
    
    // Cargar el contenido de todos los archivos
    const fileContents = files.map(file => {
      const filePath = path.join(knowledgeDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return { file, content };
    });
    
    // Encontrar el archivo más relevante para la consulta del usuario
    const mostRelevantFile = await findMostRelevantFile(fileContents, query);
    
    if (!mostRelevantFile) {
      console.warn('No se pudo determinar el archivo más relevante');
      return "No se encontró información específica relacionada con tu consulta.";
    }
    
    console.log(`Archivo más relevante para la consulta "${query}": ${mostRelevantFile.file}`);
    
    // Procesamiento del archivo de conocimiento para organizar la información
    const knowledge = processKnowledgeFile(mostRelevantFile.content);
    
    return knowledge;
  } catch (error) {
    console.error('Error al recuperar conocimiento:', error);
    return "Lo siento, hubo un problema al recuperar la información. Por favor, intenta de nuevo.";
  }
};

/**
 * Encuentra el archivo más relevante para la consulta del usuario
 */
async function findMostRelevantFile(files: { file: string, content: string }[], query: string): Promise<{ file: string, content: string } | null> {
  try {
    // Si solo hay un archivo, devolverlo directamente
    if (files.length === 1) {
      return files[0];
    }
    
    // Preparar el prompt para OpenAI
    const filesInfo = files.map((file, index) => {
      // Extraer título y patrones de detección para cada archivo
      const titleMatch = file.content.match(/# (.*)/);
      const title = titleMatch ? titleMatch[1] : file.file;
      
      // Extraer patrones de detección
      let patterns = [];
      const patternsSection = file.content.match(/## Patrones de Detección\s+([\s\S]*?)(?=##|$)/);
      
      if (patternsSection) {
        patterns = patternsSection[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').replace(/"/g, '').trim());
      }
      
      return `Archivo ${index + 1}: ${title}\nPatrones: ${patterns.join(', ')}`;
    }).join('\n\n');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente que ayuda a determinar cuál de los siguientes archivos de conocimiento es más relevante para responder a la consulta del usuario. 
          Analiza los títulos y patrones de detección de cada archivo y selecciona el número del archivo más apropiado.`
        },
        {
          role: 'user',
          content: `Aquí están los archivos disponibles:\n\n${filesInfo}\n\nConsulta del usuario: "${query}"\n\n¿Cuál de estos archivos (indica solo el número) es más relevante para responder a esta consulta?`
        }
      ],
      max_tokens: 50,
      temperature: 0.3,
    });
    
    const content = response.choices[0]?.message?.content || '';
    
    // Intentar extraer el número del archivo seleccionado
    const numberMatch = content.match(/(\d+)/);
    
    if (numberMatch) {
      const fileIndex = parseInt(numberMatch[1]) - 1;
      
      if (fileIndex >= 0 && fileIndex < files.length) {
        return files[fileIndex];
      }
    }
    
    // Si no se pudo determinar, usar heurística simple basada en coincidencia de palabras clave
    const wordMatches = files.map(file => {
      const words = query.toLowerCase().split(/\s+/);
      let matchCount = 0;
      
      for (const word of words) {
        if (word.length > 3 && file.content.toLowerCase().includes(word)) {
          matchCount++;
        }
      }
      
      return { file, matchCount };
    });
    
    // Ordenar por número de coincidencias (mayor a menor)
    wordMatches.sort((a, b) => b.matchCount - a.matchCount);
    
    // Retornar el archivo con más coincidencias
    return wordMatches[0].matchCount > 0 ? wordMatches[0].file : files[0];
  } catch (error) {
    console.error('Error al encontrar archivo más relevante:', error);
    return files[0]; // Devolver el primer archivo por defecto
  }
}

/**
 * Procesa un archivo de conocimiento para extraer y organizar la información
 */
function processKnowledgeFile(content: string): string {
  // Extraer el título
  const titleMatch = content.match(/# (.*)/);
  const title = titleMatch ? titleMatch[1] : 'Información';
  
  // Extraer respuestas predeterminadas
  const responsesSection = content.match(/## Respuestas Predeterminadas\s+([\s\S]*?)(?=## |$)/);
  const responses = responsesSection ? responsesSection[1] : '';
  
  // Extraer datos para IA
  const aiDataSection = content.match(/## Datos para IA\s+([\s\S]*?)(?=## |$)/);
  const aiData = aiDataSection ? aiDataSection[1] : '';
  
  // Extraer flujo de conversación
  const flowSection = content.match(/## Flujo de Conversación\s+([\s\S]*?)(?=## |$)/);
  const flow = flowSection ? flowSection[1] : '';
  
  // Combinar las secciones relevantes
  let processedContent = `# ${title}\n\n`;
  
  if (aiData.trim()) {
    processedContent += `## Información Contextual\n${aiData}\n\n`;
  }
  
  if (responses.trim()) {
    processedContent += `## Respuestas Disponibles\n${responses}\n\n`;
  }
  
  if (flow.trim()) {
    processedContent += `## Guía de Respuesta\n${flow}\n\n`;
  }
  
  return processedContent;
}

/**
 * Determina el tipo de cliente basado en sus datos
 * 
 * @param customer Datos del cliente
 * @returns Tipo de cliente identificado
 */
export const determineCustomerType = (customer: any): string => {
  // Valores por defecto
  let customerType = 'prospecto';
  
  // Verificar si es un estudiante activo
  if (customer.status === 'activo' && customer.examType) {
    customerType = 'estudiante';
    
    // Determinar si es un estudiante de área específica
    if (customer.aspirantTo) {
      const aspirantLower = customer.aspirantTo.toLowerCase();
      
      if (aspirantLower.includes('medicina') || 
          aspirantLower.includes('odontología') || 
          aspirantLower.includes('psicología') || 
          aspirantLower.includes('nutrición') || 
          aspirantLower.includes('enfermería')) {
        customerType = 'estudiante_salud';
      } else if (aspirantLower.includes('ingeniería') || 
                aspirantLower.includes('arquitectura') || 
                aspirantLower.includes('sistemas')) {
        customerType = 'estudiante_ingenieria';
      }
    }
  } 
  // Verificar si es un egresado
  else if (customer.status === 'egresado') {
    customerType = 'exalumno';
  }
  // Verificar si es un cliente inactivo
  else if (customer.status === 'inactivo') {
    customerType = 'inactivo';
  }
  // Verificar si es un cliente suspendido
  else if (customer.status === 'suspendido') {
    customerType = 'moroso';
  }
  
  return customerType;
}; 