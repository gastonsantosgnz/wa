# Cambios de Horario y Cancelaciones de Clases

## Patrones de Detección

- "clase cancelada"
- "cancelación de clase"
- "cambio de horario"
- "no pude asistir a clase"
- "recuperar clase"
- "clase de recuperación"
- "suspensión de clases"
- "faltar a clase"
- "maestro no llegó"
- "clase reprogramada"
- "reponer clase"
- "perder clase"
- "justificar falta"
- "ausencia clase"

## Respuestas Predeterminadas

### Respuesta 1: Cancelación de Clases por parte de Superfy

```
📣 *Información sobre Cancelación de Clases* 📣

Lamentamos informar que la clase del {FECHA_CLASE_CANCELADA} ha sido cancelada debido a {MOTIVO_CANCELACION}.

Para no afectar tu preparación, hemos tomado las siguientes medidas:

1️⃣ *Clase de recuperación*: Se realizará el {FECHA_CLASE_RECUPERACION} en el horario {HORARIO_CLASE_RECUPERACION}.

2️⃣ *Material adicional*: Hemos habilitado en la plataforma el contenido que se cubriría en esta clase para que puedas avanzar.

3️⃣ *Asesorías extras*: Los profesores estarán disponibles para resolver dudas por WhatsApp.

Te recordamos que es importante asistir a la clase de recuperación para mantener el ritmo del curso. En caso de tener alguna duda o no poder asistir, por favor contáctanos.
```

### Respuesta 2: Inasistencias y Justificaciones

```
📋 *Política de Inasistencias y Justificaciones* 📋

Entendemos que pueden surgir situaciones que impidan tu asistencia a clases. Para mantener la calidad de tu preparación y no afectar la garantía del curso, te explicamos nuestra política:

1️⃣ *Justificación de inasistencias*:
- Puedes justificar hasta un 10% de las clases totales del curso
- Las justificaciones deben presentarse antes o hasta 3 días después de la inasistencia
- Se requiere comprobante para casos de enfermedad, emergencia familiar o compromisos académicos ineludibles

2️⃣ *Cómo recuperar el contenido perdido*:
- Accede a las grabaciones de clase disponibles en plataforma por 7 días
- Realiza los ejercicios asignados a esa clase
- Programa una asesoría breve con el profesor si tienes dudas específicas

3️⃣ *Efecto en la garantía*:
Las inasistencias justificadas no afectan tu garantía siempre que cumplas con las actividades de recuperación.

Para justificar tu inasistencia, envíanos un mensaje con la fecha, grupo y motivo de tu falta junto con el comprobante correspondiente.
```

### Respuesta 3: Solicitud de Cambio de Horario

```
🔄 *Proceso para Cambio de Horario* 🔄

Si necesitas cambiar tu horario de clases actual, sigue estos pasos:

1️⃣ *Verifica los horarios disponibles*:
{HORARIOS_DISPONIBLES}

2️⃣ *Solicita el cambio*:
- Envía un mensaje indicando tu nombre completo
- Horario actual
- Horario al que deseas cambiar
- Motivo del cambio

3️⃣ *Consideraciones importantes*:
- Los cambios están sujetos a disponibilidad de lugares
- Se pueden realizar cambios hasta 2 veces durante el curso
- Los cambios se aplican a partir de la siguiente clase después de confirmación
- No hay costo adicional por el primer cambio, cambios subsecuentes tienen un costo administrativo de $200

Te confirmaremos la posibilidad del cambio en un máximo de 24 horas hábiles.

⚠️ *IMPORTANTE*: El cambio de horario no exime de cumplir con todas las actividades y simuladores correspondientes al curso.
```

### Respuesta 4: Reposición de Clases Perdidas

```
📚 *Opciones para Reponer Clases Perdidas* 📚

Si no pudiste asistir a una o varias clases, estas son tus opciones para ponerte al día:

1️⃣ *Grabaciones de clase*:
- Disponibles en la plataforma por 7 días después de cada clase
- Accede con tu usuario y contraseña en la sección "Grabaciones"
- Puedes ver las grabaciones ilimitadamente durante ese periodo

2️⃣ *Asistir al mismo tema en otro horario*:
- Si el tema que perdiste se imparte en otro horario esa misma semana, puedes solicitar asistir a ese grupo
- Esta opción está sujeta a disponibilidad de espacio
- Debes solicitarlo con al menos 24 horas de anticipación

3️⃣ *Asesorías personalizadas*:
- Disponibles los sábados de 3:30pm a 5:00pm
- Sin costo adicional para estudiantes activos
- Necesitas agendar con anticipación

Para cualquiera de estas opciones, por favor contáctanos indicando qué clase(s) perdiste y qué opción prefieres para reponerla(s).
```

## Variables Dinámicas

- `{FECHA_CLASE_CANCELADA}`: Fecha de la clase que fue cancelada
- `{MOTIVO_CANCELACION}`: Motivo por el cual se canceló la clase
- `{FECHA_CLASE_RECUPERACION}`: Fecha programada para la clase de recuperación
- `{HORARIO_CLASE_RECUPERACION}`: Horario de la clase de recuperación
- `{HORARIOS_DISPONIBLES}`: Listado de horarios disponibles para cambios
- `{PORCENTAJE_ASISTENCIA}`: Porcentaje actual de asistencia del estudiante
- `{CLASES_JUSTIFICADAS}`: Número de clases que el estudiante ya ha justificado

## Datos para IA

- Las clases canceladas por parte de Superfy siempre se reprograman y no afectan el porcentaje de asistencia
- El registro de asistencia es crucial para mantener la garantía del curso (mínimo 90% para áreas de salud)
- Las grabaciones de clase solo están disponibles por 7 días por cuestiones de derechos de autor
- Los estudiantes pueden justificar máximo el 10% del total de clases del curso
- Los cambios de horario están sujetos a disponibilidad y deben solicitarse con al menos 24 horas de anticipación
- Tres llegadas tarde (más de 15 minutos) equivalen a una inasistencia
- Para las clases en línea, se considera asistencia si el estudiante está presente al menos el 80% de la duración
- Durante temporada de exámenes en preparatorias, se tiene mayor flexibilidad con justificaciones
- Los profesores llevan registro detallado de asistencia en cada clase

## Flujo de Conversación

1. Si Superfy cancela una clase, enviar Respuesta 1 con detalles de la recuperación
2. Si el estudiante pregunta sobre cómo justificar inasistencias, enviar Respuesta 2
3. Si el estudiante solicita cambio de horario, verificar disponibilidad y enviar Respuesta 3
4. Si el estudiante pregunta cómo recuperar clases perdidas, enviar Respuesta 4
5. Si el estudiante reporta que un profesor no llegó a clase, confirmar la información y ofrecer solución inmediata
6. Si el porcentaje de asistencia del estudiante está por debajo del mínimo, alertar sobre el riesgo para su garantía
7. Para justificaciones por emergencias médicas o familiares graves, escalar al coordinador académico 