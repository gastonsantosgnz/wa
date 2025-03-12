# Documentación de Knowledge Base para WhatsApp CRM

## Introducción

Este documento describe la estructura y funcionamiento del sistema de base de conocimiento (Knowledge Base) utilizado por el WhatsApp CRM. La base de conocimiento está diseñada para proporcionar respuestas automáticas a consultas comunes de los usuarios, permitiendo una atención inmediata y consistente.

## Estructura de Archivos

La base de conocimiento se organiza en carpetas temáticas, cada una conteniendo archivos Markdown que definen intenciones específicas:

```
knowledge_base/
├── academico/                  # Temas académicos
│   ├── preguntas_frecuentes.md
│   └── ...
├── admision_uabc/              # Proceso de admisión
│   ├── convocatoria.md
│   ├── curp_extranjeros.md
│   ├── examen_admision.md
│   ├── preficha.md
│   └── ...
├── contacto/                   # Información de contacto
│   ├── ubicaciones.md
│   └── ...
├── cursos/                     # Información de cursos
│   ├── becas.md
│   ├── curso_intensivo.md
│   ├── curso_online.md
│   ├── curso_presencial_general.md
│   ├── curso_presencial_salud.md
│   ├── cursos_uabc.md
│   ├── descripcion_general.md
│   ├── estado_cursos.md
│   └── garantías.md
├── garantias/                  # Políticas de garantía
│   ├── politicas_garantia.md
│   └── ...
├── pagos/                      # Información de pagos
│   ├── metodos_pagos.md
│   └── ...
├── soporte_tecnico/            # Soporte técnico
│   ├── acceso_plataforma.md
│   ├── certificados.md
│   ├── simuladores.md
│   └── ...
├── testimonios/                # Casos de éxito
│   ├── casos_exito.md
│   └── ...
└── README.md                   # Este archivo
```

## Estructura de los Archivos de Knowledge Base

Cada archivo de la base de conocimiento sigue una estructura estandarizada con las siguientes secciones:

### 1. Título de la Intención

```markdown
# Título de la Intención
```

El título debe ser descriptivo y representar claramente el tema o intención que aborda el archivo.

### 2. Patrones de Detección

```markdown
## Patrones de Detección

- "palabra clave 1"
- "frase completa"
- "pregunta frecuente"
- "variación de la pregunta"
```

Esta sección contiene una lista de palabras clave, frases o patrones que el sistema utiliza para identificar la intención del usuario. Cuantos más patrones se incluyan, más precisa será la detección de la intención.

### 3. Respuestas Predeterminadas

```markdown
## Respuestas Predeterminadas

### Respuesta 1: Título Descriptivo

```
Texto de la respuesta predeterminada 1. 
Puede incluir:
- Viñetas
- *Formato markdown* para énfasis
- Emojis 📱
- Links: https://ejemplo.com
```

### Respuesta 2: Otro Título Descriptivo

```
Texto de la respuesta predeterminada 2.
```
```

Cada respuesta predeterminada debe tener:
- Un título descriptivo que indique su propósito
- El texto completo de la respuesta encerrado en bloques de código (```)
- Formato adecuado usando Markdown y emojis para mejorar la legibilidad

### 4. Variables Dinámicas

```markdown
## Variables Dinámicas

- `{NOMBRE_VARIABLE}`: Descripción de la variable y su propósito
- `{OTRA_VARIABLE}`: Descripción de esta variable
```

Lista de variables que pueden ser reemplazadas dinámicamente en las respuestas predeterminadas. Estas variables permiten personalizar las respuestas según el contexto o información del usuario.

### 5. Datos para IA

```markdown
## Datos para IA

- Información contextual relevante para la IA
- Datos complementarios que ayudan a generar respuestas
- Restricciones o consideraciones especiales
- Conocimiento específico del dominio
```

Proporciona información complementaria que la IA puede utilizar para generar respuestas más precisas cuando no hay una respuesta predeterminada adecuada o cuando se requiere personalización adicional.

### 6. Flujo de Conversación

```markdown
## Flujo de Conversación

1. Si el usuario pregunta sobre X, enviar Respuesta 1
2. Si el usuario solicita Y, enviar Respuesta 2
3. Si el usuario menciona Z, solicitar más detalles con Respuesta 3
4. Si la consulta requiere atención humana, transferir a un agente
```

Define la lógica de cómo el sistema debe manejar diferentes escenarios dentro de la misma intención. Proporciona instrucciones sobre qué respuesta utilizar en cada situación.

## Ejemplos de Uso

### Ejemplo 1: Respuesta Simple

```markdown
# Información de Contacto

## Patrones de Detección

- "contacto"
- "teléfono"
- "email"
- "dirección"

## Respuestas Predeterminadas

### Respuesta 1: Información General

```
📞 *Contacto Superfy*

Teléfono: (664) 123-4567
Email: info@superfy.pro
Dirección: Blvd. Sánchez Taboada 10611-301, Zona Río, Tijuana

Horario de atención:
Lunes a viernes: 9am a 7pm
Sábados: 9am a 2pm
```

## Variables Dinámicas

- `{HORARIO_ACTUAL}`: Horario actual basado en temporada

## Datos para IA

- Recordar mencionar que en temporada alta puede haber espera
- Sugerir contacto por WhatsApp para respuesta más rápida

## Flujo de Conversación

1. Si el usuario solicita información de contacto, enviar Respuesta 1
2. Si pregunta por horarios específicos, personalizar respuesta con horarios detallados
```

### Ejemplo 2: Múltiples Respuestas con Variables

```markdown
# Información de Cursos

## Patrones de Detección

- "curso en línea"
- "curso online"
- "curso virtual"

## Respuestas Predeterminadas

### Respuesta 1: Información General

```
🖥️ *Curso En Línea UABC 2025*

Duración: 6 semanas
Horario: Lunes a jueves, 7pm a 9pm
Inicio: {FECHA_INICIO}
Costo: ${PRECIO_CURSO}
```

### Respuesta 2: Detalles Técnicos

```
💻 *Requisitos Técnicos*

- Computadora con acceso a internet
- Cámara y micrófono
- Cuenta de Zoom
- Navegador actualizado

Las clases quedan grabadas por {DIAS_DISPONIBILIDAD} días.
```

## Variables Dinámicas

- `{FECHA_INICIO}`: Fecha de inicio del próximo curso
- `{PRECIO_CURSO}`: Precio actual del curso
- `{DIAS_DISPONIBILIDAD}`: Días que las grabaciones están disponibles

## Datos para IA

- El curso en línea tiene cupo limitado de 30 estudiantes
- Incluye acceso a plataforma hasta la fecha del examen
- Los materiales físicos se envían por paquetería

## Flujo de Conversación

1. Si el usuario pregunta información general, enviar Respuesta 1
2. Si pregunta por requisitos técnicos, enviar Respuesta 2
3. Si pregunta por ambos, enviar las dos respuestas en secuencia
```

## Integración con el Sistema

### Proceso de Clasificación de Intenciones

El sistema utiliza el archivo `intent.service.ts` para clasificar las intenciones del usuario basándose en los patrones de detección definidos en los archivos de knowledge base.

1. **Clasificación**: Analiza el mensaje del usuario y determina la intención más probable.
2. **Recuperación**: Busca el archivo correspondiente en la base de conocimiento.
3. **Selección de respuesta**: Utiliza el flujo de conversación para determinar qué respuesta predeterminada usar.
4. **Personalización**: Reemplaza las variables dinámicas con datos del contexto o del usuario.
5. **Respuesta**: Envía la respuesta al usuario a través de WhatsApp.

### Personalización con Datos del Cliente

El sistema puede personalizar las respuestas utilizando la información del cliente almacenada en la base de datos:

```typescript
// Ejemplo de personalización en ai.service.ts
const personalizedResponse = response
  .replace('{NOMBRE_CLIENTE}', customer.name)
  .replace('{CURSO_INSCRITO}', customer.examType || 'Curso UABC')
  .replace('{FECHA_PROXIMO_PAGO}', calculateNextPaymentDate(customer));
```

## Mejores Prácticas para la Base de Conocimiento

1. **Patrones de detección específicos**: Incluir variaciones comunes de las preguntas, incluyendo errores ortográficos frecuentes.

2. **Respuestas concisas**: Mantener las respuestas claras y directas, evitando información excesiva.

3. **Formato visual**: Utilizar emojis, negritas y viñetas para mejorar la legibilidad en WhatsApp.

4. **Variables significativas**: Nombrar las variables de forma descriptiva y documentar claramente su propósito.

5. **Datos para IA completos**: Proporcionar suficiente contexto para que la IA pueda generar respuestas precisas cuando sea necesario.

6. **Flujos de conversación claros**: Definir reglas de decisión específicas para cada escenario posible.

7. **Actualización regular**: Mantener la información actualizada, especialmente fechas, precios y datos de contacto.

## Mantenimiento y Actualización

Para mantener la base de conocimiento actualizada:

1. Revisar regularmente la precisión de la información (precios, fechas, políticas)
2. Analizar las conversaciones donde el sistema no pudo proporcionar una respuesta adecuada
3. Añadir nuevos patrones de detección basados en preguntas reales de los usuarios
4. Actualizar o añadir respuestas predeterminadas para cubrir nuevos escenarios
5. Refinar los flujos de conversación para mejorar la experiencia del usuario

## Conclusión

Esta estructura estandarizada permite crear una base de conocimiento robusta y fácil de mantener. Al seguir este formato, el sistema puede proporcionar respuestas precisas, personalizadas y coherentes a las consultas de los usuarios, mejorando la experiencia general del servicio al cliente.

Para cualquier consulta adicional sobre la estructura o la implementación de la base de conocimiento, contactar al equipo de desarrollo. 