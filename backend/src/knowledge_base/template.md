# [Título de la Intención]

## Patrones de Detección

- "palabra clave 1"
- "palabra clave 2"
- "frase específica"
- "pregunta común 1"
- "pregunta común 2"
- "variación de pregunta"
- "error común de ortografía"

## Respuestas Predeterminadas

### Respuesta 1: [Título Descriptivo de la Primera Respuesta]

```
[Texto de la primera respuesta]

[Puede incluir formato como:]
- Viñetas de información
- Varios párrafos

[Y también puede usar:]
*Texto en negrita* para destacar información importante
[Enlaces](https://ejemplo.com) para recursos externos
```

### Respuesta 2: [Título Descriptivo de la Segunda Respuesta]

```
[Texto de la segunda respuesta]

[Ejemplo con emojis:]
✅ Punto positivo uno
✅ Punto positivo dos
⚠️ Advertencia importante
📆 Fechas relevantes: DD/MM/AAAA
```

### Respuesta 3: [Título Descriptivo de la Tercera Respuesta]

```
[Texto de la tercera respuesta]

[Ejemplo con variables dinámicas:]
Estimado/a {NOMBRE_CLIENTE}, 
Tu curso {CURSO_ACTUAL} comienza el {FECHA_INICIO}.
El costo total es ${PRECIO_CURSO}.
```

## Variables Dinámicas

- `{NOMBRE_CLIENTE}`: Nombre del cliente extraído de la base de datos
- `{CURSO_ACTUAL}`: Curso en el que está inscrito el cliente o en el que mostró interés
- `{FECHA_INICIO}`: Fecha de inicio del próximo curso disponible
- `{PRECIO_CURSO}`: Precio actual del curso según el plan seleccionado
- `{VARIABLE_5}`: Descripción de la quinta variable

## Datos para IA

- [Información contextual para la IA sobre este tema]
- [Hechos importantes que pueden ayudar a generar respuestas más precisas]
- [Limitaciones o restricciones que deben considerarse]
- [Conocimiento específico del dominio relacionado con esta intención]
- [Casos especiales o excepciones que requieren atención]
- [Datos estadísticos relevantes]
- [Definiciones importantes]
- [Políticas aplicables]

## Flujo de Conversación

1. Si el usuario pregunta información general sobre [tema], usar Respuesta 1
2. Si el usuario solicita detalles específicos sobre [aspecto], usar Respuesta 2
3. Si el usuario ya está inscrito y pregunta sobre [tema], personalizar Respuesta 3 con sus datos
4. Si el usuario muestra confusión después de recibir una respuesta, aclarar con información adicional
5. Si el usuario requiere asistencia especializada sobre [tema complejo], transferir a un agente humano
6. Si el usuario menciona [palabras clave de urgencia], priorizar y escalar según procedimiento 