import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Verificar variables de entorno
const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

// Validar que las variables de entorno estén definidas
if (!token || !phoneNumberId) {
  throw new Error('WHATSAPP_TOKEN y WHATSAPP_PHONE_NUMBER_ID son requeridos');
}

// URL base para la API de WhatsApp
const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

// Mensajes predeterminados para el curso en línea
const CURSO_ONLINE_MENSAJES = [
  // Mensaje 1: Información general
  `🤓 Curso En Línea UABC 2025 💻
Dirigido para todas las carreras
✅ Áreas de la Salud
✅ Ingenierías
✅ Contable-Administrativas
✅ Humanidades
✅ Ciencias
✅ Gastronomía

☑️ Aplica para todo Baja California 
Tijuana, Mexicali, Ensenada, Tecate y Rosarito 


🖥️ Contamos con nuestra propia plataforma de estudio donde realizarán los exámenes de práctica y simuladores predictivos con intentos ilimitados.

🗓️ Iniciamos lunes 17 de marzo
📘 De lunes a jueves
⏰ De 7pm a 9pm
⏳ Duración de 6 semanas
🔋 48 horas de curso
🖥️  Clases en vivo por Zoom
📝 6 Simuladores Predictivos
🧠 Exámenes de práctica por temas
📚 Incluye manuales impresos
👍 Mate, Lengua y Lectura (ExIES 2025)`,

  // Mensaje 2: Ubicación
  `📍 Estamos ubicados en Zona Río, Tijuana, en el Instituto Aranguré
https://maps.app.goo.gl/ezg78wQ89fy118mv8`,

  // Mensaje 3: Planes de pago
  `🟢 Ofrecemos los siguientes planes de pago
Planes de pago

Para apartar lugar en el curso solo es necesario pagar la inscripción de $200 mxn. El primer pago se realiza al iniciar el curso de acuerdo al plan que elijan. La inscripción se considera aparte.

1 pago (más popular)
$2,400
Al pagar en una sola exhibición obtienen un descuento de $600 pesos sobre el costo original.

2 pagos
$3,000 (precio original)
Serían 2 pagos de $1,500 pesos, uno el primer día de curso y el otro 3 semanas después. Esta forma de pago no incluye descuento.`,

  // Mensaje 4: Pasos para inscribirse
  `Pasos para inscribirse 👇
1️⃣ Mandar a este WhatsApp
- nombre del alumno
- ⁠carrera a la que aplicará
- ⁠WhatsApp del alumno
- ⁠promedio aprox de la prepa
- ⁠ciudad
- ⁠grupo al que se quiere inscribir
2️⃣ Para formalizar la inscripción, hay que hacer el pago de Inscripción de $200 pesos ya sea en nuestras oficinas, depósito en OXXO o transferencia.
3️⃣ Una recibidos los datos y hecho el pago, agregaremos al estudiante al grupo de WhatsApp de Aspirantes. Por ese medio estaremos dando todos los avisos e instrucciones para el primer día de curso.

⚠️ IMPORTANTE
El resto de los pagos iniciarían hasta el primer día del curso, de acuerdo al plan que hayan elegido.`,

  // Mensaje 5: Información técnica
  `🔵 👨‍💻 Este curso en línea será impartido a través de Zoom 👩‍💻🔵 
Será necesario tener acceso an internet estable y un dispositivo para conectarse, ya sea laptop, celular o tableta. 

💻 Este curso se complementa con el uso de nuestra plataforma de Superfy, en donde estaremos asignando todas las actividades del curso cada semana. Será importante dedicarle al menos 2 horas de trabajo en plataforma extras a las clases por Zoom.

📚 Este curso incluye nuestros 2 cuadernillos de trabajo impresos. Se entregarán en nuestras oficinas de Tijuana. Si eres de otra ciudad, podemos hacer el envío por $300 pesos extras (Baja California).`
];

// Mensajes predeterminados para el curso de Áreas de la Salud
const CURSO_SALUD_MENSAJES = [
  // Mensaje 1: Información general
  `🧠 Curso UABC 2024 Áreas de la Salud 🥼

Este curso va dirigido a aspirantes a carreras del Área de la Salud
✅ Medicina
✅ Odontología
✅ Enfermería
✅ Nutrición
✅ Psicología
✅ Fisioterapia

⭐️ Es el único curso que cuenta con Garantía de Reembolso. Sí el alumno cumple con los requisitos y hace todas las actividades del curso y no queda seleccionado, se le regresa un porcentaje del dinero o de le da el siguiente curso gratis 😉

🖥️ Contamos con nuestra propia plataforma de estudio donde realizarán los Exámenes y Simuladores con intentos ilimitados.

🗓️ Iniciamos sábado 26 de Octubre
🟢 Sábados y entre semana
⏳ Duración de 22 semanas
📘 Manuales impresos incluidos
📝 Simuladores Predictivos
🧠 Reporte de resultados por alumno
👍 Mate, Lengua y Lectura (ExIES 2025)

🌟 Cada año vamos a hacer el examen real a UABC y actualizamos nuestro material de estudio 🤓👌`,

  // Mensaje 2: Grupos disponibles
  `🟢 Grupos disponibles
1️⃣ Sábados 9am a 1:30pm
2️⃣ Sábados 2pm a 6:30pm
3️⃣ Lunes y miércoles 4pm a 6:15pm
4️⃣ Martes y jueves 4pm a 6:15pm

*Los grupos serán de máximo 25 alumnos cada uno.

📍 Estamos ubicados en Zona Río, en el Instituto Aranguré`,

  // Mensaje 3: Planes de pago
  `🟢 Ofrecemos las siguientes opciones de pago
Planes de Pago

Para apartar un lugar en el curso solo es necesario pagar la inscripción de $500 mxn.
Al iniciar el curso, se deberán iniciar el resto de los pagos de acuerdo a la forma de pago que mejor se les acomode.

1 pago
Al pagar en una sola exhibición obtienen un descuento de $3,500 pesos sobre el costo original.
$9,000 

5 pagos
Serían 5 pagos de $2,200 pesos cada 4 semanas. Esta forma incluye un descuento de $1,500 pesos.
$11,000

10 pagos
Serían 10 pagos de $1,250 pesos cada 2 semanas. Esta forma de pago no incluye ningún descuento.
$12,500 (costo original)`
];

// Mensajes predeterminados para el curso de Enero
const CURSO_ENERO_MENSAJES = [
  // Mensaje 1: Información general
  `🤓 Curso UABC Enero 2025 - Todas las Carreras 🚀

✅ Áreas de la Salud
✅ Ingenierías
✅ Administrativas
✅ Humanidades
✅ Gastronomía
✅ Químicas
✅ Derecho

⭐️ Único curso que cuenta con Garantía de Reembolso. Sí el alumno cumple con los requisitos y hace todas las actividades del curso en tiempo y forma, queda porque queda, si no, se le regresa un porcentaje del dinero o se le da el siguiente curso gratis 😉

🖥️ Contamos con nuestra propia plataforma de estudio donde realizarán los Exámenes y Simuladores con intentos ilimitados.

🗓️ Iniciamos sábado 18 de Enero
🟢 Sábados, domingos y entre semana
⏳ Duración de 14 semanas
📘 Manuales impresos incluidos
📝 6 Simuladores Predictivos
🧠 Reporte de resultados por alumno
👍 Mate, Lengua y Lectura (ExIES 2025)

🌟 Cada año vamos a hacer el examen real a UABC y actualizamos nuestro material de estudio 😉👌`,

  // Mensaje 2: Grupos disponibles
  `🟢 Grupos disponibles
1️⃣ Sábados 10am a 3pm
2️⃣ Sábados 1:30pm a 6:30pm
3️⃣ Domingo 10am a 3pm
4️⃣ Lunes y miércoles 4pm a 6:30pm
5️⃣ Martes y jueves 4pm a 6:30pm

⚠️ Cupo limitado. Favor de apartar su lugar con tiempo
‼️ Los grupos serán de máximo 25 alumnos cada uno.

📍 Estamos ubicados en Zona Río, en el Instituto Aranguré`,

  // Mensaje 3: Planes de pago
  `Planes de pago

Para apartar un lugar en el curso solo es necesario pagar la inscripción de $500 mxn.
Al iniciar el curso, se deberán iniciar el resto de los pagos de acuerdo a la opción de pago que elijan.

1 pago
Al pagar en una sola exhibición obtienen un descuento de $2,200 pesos sobre el costo original.
$6,200 

3 pagos
Serían 3 pagos de $2,400 pesos cada 4 semanas. Esta forma incluye un descuento de $1,200 pesos.
$7,200

6 pagos
Serían 6 pagos de $1,400 pesos cada 2 semanas. Esta forma de pago no incluye ningún descuento.
$8,400 (costo original)`,

  // Mensaje 4: Pasos para inscribirse
  `Pasos para inscribirse 👇
1️⃣ Llenar Formulario de Inscripción
https://www.superfy.pro/inscripciones-uabc-presencial
2️⃣ Para formalizar la inscripción, hay que hacer el Pago de Inscripción de $500 pesos ya sea en nuestras oficinas, depósito en OXXO o transferencia.
3️⃣ Una vez hecho el pago, agregaremos al estudiante al grupo de WhatsApp de Aspirantes. Por ese medio estaremos dando todos los avisos e instrucciones para el primer día de curso.

⚠️ IMPORTANTE
El resto de los pagos iniciarían hasta el primer día del curso, de acuerdo al plan que hayan elegido.`
];

// Mensajes predeterminados para el curso Intensivo
const CURSO_INTENSIVO_MENSAJES = [
  // Mensaje 1: Información general
  `🤩 Curso UABC Marzo 2025 - Intensivo 🚀

✅ Áreas de la Salud
✅ Ingenierías
✅ Administrativas
✅ Humanidades
✅ Gastronomía
✅ Químicas
✅ Derecho

⭐️ Único curso que cuenta con Garantía de Reembolso. Sí el alumno cumple con los requisitos y hace todas las actividades del curso en tiempo y forma, queda porque queda, si no, se le regresa un porcentaje del dinero o se le da el siguiente curso gratis 😉

🖥️ Contamos con nuestra propia plataforma de estudio donde realizarán los Exámenes y Simuladores con intentos ilimitados.

🗓️ Iniciamos domingo 2 de marzo
🟢 Domingos y entre semana
⏳ Duración de 8 semanas
📘 Manuales impresos incluidos
📝 6 Simuladores Predictivos
🧠 Reporte de resultados por alumno
👍 Mate, Lengua y Lectura (ExIES 2025)

🌟 Cada año vamos a hacer el examen real a UABC y actualizamos nuestro material de estudio 😉👌`,

  // Mensaje 2: Grupos disponibles
  `🟢 Grupos disponibles
1️⃣ Domingo 9:30am 3:30pm
2️⃣ Martes y Jueves de 4:30pm a 7:30pm
3️⃣ Martes, miércoles y jueves 6:30pm a 8:30pm

⚠️ Cupo limitado. Favor de apartar su lugar con tiempo.
‼️ Los grupos serán de máximo 25 alumnos cada uno.

📍 Estamos ubicados en Zona Río, en el Instituto Aranguré
https://maps.app.goo.gl/ezg78wQ89fy118mv8`,

  // Mensaje 3: Planes de pago
  `🟢 Ofrecemos las siguientes opciones de pago

Planes de pago

Para apartar un lugar en el curso solo es necesario pagar la inscripción de $500 mxn. Al iniciar el curso, se deberán iniciar el resto de los pagos de acuerdo a la opción de pago que elijan.

2 pagos
$5,800 
Serían 2 pagos de $2,900 pesos cada 4 semanas. Esta forma incluye un descuento de $1,000 pesos.

1 pago (más popular)
$4,800 
Al pagar en una sola exhibición obtienen un descuento de $2,000 pesos sobre el costo original.

4 pagos
$6,800 (precio original)
Serían 4 pagos de $1,700 pesos cada 2 semanas. Esta forma de pago no incluye ningún descuento.`,

  // Mensaje 4: Pasos para inscribirse
  `Pasos para inscribirse 👇
1️⃣ Llenar Formulario de Inscripción
https://www.superfy.pro/inscripciones-uabc-presencial
2️⃣ Para formalizar la inscripción, hay que hacer el Pago de Inscripción de $500 pesos ya sea en nuestras oficinas, depósito en OXXO o transferencia.
3️⃣ Una vez hecho el pago, agregaremos al estudiante al grupo de WhatsApp de Aspirantes. Por ese medio estaremos dando todos los avisos e instrucciones para el primer día de curso.

⚠️ IMPORTANTE
El resto de los pagos iniciarían hasta el primer día del curso, de acuerdo al plan que hayan elegido.`,

  // Mensaje 5: Advertencia importante
  `Advertencia Importante
Este curso representará un gran desafío para nuestros alumnos
Nuestro Curso UABC Intensivo de Marzo está diseñado para cubrir todos los temas del examen de admisión pero a un ritmo acelerado. A diferencia de nuestros cursos de Octubre y Enero, este programa se enfoca en explicaciones prácticas relacionadas con las preguntas del examen, en lugar de abarcar temas completos en profundidad.

¿A quién va dirigido?
Este curso es ideal para aspirantes que:

•
Tienen confianza en sus conocimientos previos de preparatoria.
•
Están preparados para enfrentarse a un desafío académico intensivo.
•
Están dispuestos a comprometerse y dar un esfuerzo extra cada semana.
Si cumples con este perfil, este curso es para ti. Al inscribirte, aceptas la naturaleza intensiva del programa y te comprometes a cumplir con sus exigencias.`
];

/**
 * Normaliza un número de teléfono al formato requerido por WhatsApp
 * 
 * @param phoneNumber El número de teléfono a normalizar
 * @returns Número normalizado con formato internacional
 */
const normalizePhoneNumber = (phoneNumber: string): string => {
  // Eliminar todo lo que no sea dígito
  let normalized = phoneNumber.replace(/\D/g, '');
  
  // Identificar si el número ya tiene código de país
  // Para México, los números pueden ser:
  // - 10 dígitos (número local) → necesita agregar 52
  // - 11 dígitos (1 + número local) → necesita agregar 52 (quitando el 1 inicial)
  // - 12 dígitos (52 + número local) → ya tiene formato correcto
  // - 13 dígitos (521 + número local) → necesita corregir (52 + número local)
  
  // Número mexicano sin código de país (10 dígitos)
  if (normalized.length === 10) {
    normalized = `52${normalized}`;
  } 
  // Número mexicano con prefijo 1 (11 dígitos)
  else if (normalized.length === 11 && normalized.startsWith('1')) {
    normalized = `52${normalized.substring(1)}`;
  } 
  // Número mexicano con prefijo 521 (13 dígitos)
  else if (normalized.length === 13 && normalized.startsWith('521')) {
    normalized = `52${normalized.substring(3)}`;
  }
  // Si tiene 12 dígitos y empieza con 52, ya está en formato correcto
  
  return normalized;
};

/**
 * Envía un mensaje de texto a través de WhatsApp
 * 
 * @param to Número de teléfono del destinatario
 * @param text Texto del mensaje
 * @returns ID del mensaje enviado o null si hubo un error
 */
export const sendWhatsAppMessage = async (to: string, text: string): Promise<string | null> => {
  try {
    // Normalizar el número de teléfono al formato internacional
    const normalizedPhone = normalizePhoneNumber(to);
    
    console.log(`Enviando mensaje a: ${normalizedPhone} (Original: ${to})`);
    
    // Datos del mensaje
    let data;
    
    // Determinar si es un mensaje inicial o de seguimiento
    // Para pruebas, puedes cambiar esto según tus necesidades
    // En una implementación real, deberías verificar si ya has intercambiado mensajes con este usuario
    const isFirstMessage = false; // Cambiar a true si quieres forzar el uso de plantilla
    
    if (isFirstMessage) {
      // Para el primer mensaje, usa la plantilla hello_world
      data = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: normalizedPhone,
        type: 'template',
        template: {
          name: 'hello_world',
          language: {
            code: 'en_US'
          }
        }
      };
    } else {
      // Para mensajes de seguimiento, usa texto normal
      data = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: normalizedPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: text
        }
      };
    }
    
    // Configuración de la solicitud
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    console.log('Enviando solicitud a WhatsApp API:', JSON.stringify(data, null, 2));
    
    // Enviar mensaje
    const response = await axios.post(WHATSAPP_API_URL, data, config);
    
    // Verificar la respuesta
    if (response.data && response.data.messages && response.data.messages.length > 0) {
      console.log('Respuesta de WhatsApp API:', JSON.stringify(response.data, null, 2));
      return response.data.messages[0].id;
    } else {
      console.error('Respuesta de WhatsApp sin ID de mensaje:', response.data);
      return null;
    }
  } catch (error: any) {
    console.error('Error al enviar mensaje de WhatsApp:', error.response ? error.response.data : error);
    throw error; // Re-lanzar el error para manejarlo en el controlador
  }
};

/**
 * Envía múltiples mensajes en secuencia con un pequeño retraso entre ellos
 * 
 * @param to Número de teléfono del destinatario
 * @param messages Array de mensajes a enviar
 * @returns Array con los IDs de los mensajes enviados
 */
export const sendMultipleMessages = async (to: string, messages: string[]): Promise<(string | null)[]> => {
  const messageIds: (string | null)[] = [];
  
  for (const message of messages) {
    try {
      // Enviar mensaje
      const messageId = await sendWhatsAppMessage(to, message);
      messageIds.push(messageId);
      
      // Esperar un breve momento entre mensajes para evitar problemas de rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
      // Manejar el error de forma segura sin acceder a propiedades específicas
      console.error('Error al enviar mensaje múltiple:', e instanceof Error ? e.message : 'Error desconocido');
      messageIds.push(null);
    }
  }
  
  return messageIds;
};

/**
 * Envía información predeterminada sobre el curso en línea
 * 
 * @param to Número de teléfono del destinatario
 * @returns Array con los IDs de los mensajes enviados
 */
export const sendCursoOnlineInfo = async (to: string): Promise<(string | null)[]> => {
  console.log(`Enviando información del curso en línea a ${to}`);
  return sendMultipleMessages(to, CURSO_ONLINE_MENSAJES);
};

/**
 * Envía información predeterminada sobre el curso de Áreas de la Salud
 * 
 * @param to Número de teléfono del destinatario
 * @returns Array con los IDs de los mensajes enviados
 */
export const sendCursoSaludInfo = async (to: string): Promise<(string | null)[]> => {
  console.log(`Enviando información del curso de Áreas de la Salud a ${to}`);
  return sendMultipleMessages(to, CURSO_SALUD_MENSAJES);
};

/**
 * Envía información predeterminada sobre el curso de Enero
 * 
 * @param to Número de teléfono del destinatario
 * @returns Array con los IDs de los mensajes enviados
 */
export const sendCursoEneroInfo = async (to: string): Promise<(string | null)[]> => {
  console.log(`Enviando información del curso de Enero a ${to}`);
  return sendMultipleMessages(to, CURSO_ENERO_MENSAJES);
};

/**
 * Envía información predeterminada sobre el curso Intensivo
 * 
 * @param to Número de teléfono del destinatario
 * @returns Array con los IDs de los mensajes enviados
 */
export const sendCursoIntensivoInfo = async (to: string): Promise<(string | null)[]> => {
  console.log(`Enviando información del curso Intensivo a ${to}`);
  return sendMultipleMessages(to, CURSO_INTENSIVO_MENSAJES);
};

/**
 * Verifica el estado de un mensaje
 * 
 * @param messageId ID del mensaje a verificar
 * @returns Estado del mensaje o null si hubo un error
 */
export const getMessageStatus = async (messageId: string): Promise<string | null> => {
  try {
    // URL para consultar estado del mensaje
    const url = `https://graph.facebook.com/v17.0/${messageId}`;
    
    // Configuración de la solicitud
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    // Obtener estado del mensaje
    const response = await axios.get(url, config);
    
    return response.data.status || null;
  } catch (error) {
    console.error(`Error al obtener estado del mensaje ${messageId}:`, error);
    return null;
  }
}; 