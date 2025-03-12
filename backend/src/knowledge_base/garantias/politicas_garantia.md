# Políticas de Garantía

## Patrones de Detección

- "garantía del curso"
- "no pasé el examen"
- "quiero aplicar garantía"
- "cómo funciona la garantía"
- "requisitos garantía"
- "reembolso curso"
- "no quedé en UABC"
- "devolución del dinero"
- "garantía de aprobación"
- "condiciones de garantía"

## Respuestas Predeterminadas

### Respuesta 1: Información General sobre la Garantía

```
🔄 Garantía de Aprobación Superfy 🔄

Nuestra garantía de aprobación te asegura que si cumples con todos los requisitos y no eres admitido en la UABC, tienes dos opciones:

1️⃣ *Curso de preparación gratuito para el siguiente periodo*: Te preparamos nuevamente sin costo adicional.

2️⃣ *Reembolso del 100% del valor del curso*: Devolvemos íntegramente lo que pagaste.

Esta garantía aplica únicamente si cumples con TODOS los requisitos establecidos en nuestras políticas, los cuales puedes consultar completos en: https://www.superfy.pro/garantia

La garantía debe solicitarse dentro de los 15 días posteriores a la publicación de resultados oficiales de la UABC.
```

### Respuesta 2: Requisitos para Aplicar la Garantía

```
📋 Requisitos para Aplicar la Garantía 📋

Para hacer válida nuestra garantía de aprobación, debes cumplir con TODOS estos requisitos:

1️⃣ *Asistencia y participación*:
   - Completar el 95% del contenido del curso
   - Asistir a todas las sesiones en vivo o ver sus grabaciones

2️⃣ *Evaluaciones y simuladores*:
   - Realizar TODOS los simuladores disponibles en la plataforma
   - Obtener un promedio mínimo de 70/100 en los simuladores
   - Completar todas las evaluaciones parciales

3️⃣ *Tareas y actividades*:
   - Entregar el 90% de las tareas asignadas
   - Participar en los foros de discusión obligatorios

4️⃣ *Examen de admisión*:
   - Presentar el examen de admisión de la UABC
   - Proporcionar el comprobante oficial de no admisión

El incumplimiento de cualquiera de estos requisitos invalida automáticamente la garantía.
```

### Respuesta 3: Proceso para Solicitar la Garantía

```
🔄 Proceso para Solicitar la Garantía 🔄

Si cumpliste con todos los requisitos y no fuiste admitido en la UABC, sigue estos pasos para solicitar tu garantía:

1️⃣ *Reúne la documentación*:
   - Comprobante oficial de no admisión de la UABC
   - Número de folio o matrícula del examen

2️⃣ *Realiza la solicitud*:
   - Ingresa a tu cuenta en www.superfy.pro
   - Ve a "Mi Perfil" > "Mis Cursos" > "Solicitar Garantía"
   - Completa el formulario y adjunta la documentación

3️⃣ *Proceso de revisión*:
   - Nuestro equipo verificará el cumplimiento de los requisitos
   - El proceso toma entre 5 a 10 días hábiles

4️⃣ *Resolución*:
   - Recibirás un correo con la resolución
   - Si es aprobada, podrás elegir entre un nuevo curso o reembolso

La solicitud debe realizarse dentro de los 15 días posteriores a la publicación de resultados oficiales de la UABC.
```

## Variables Dinámicas

- `{FECHA_LIMITE_SOLICITUD}`: Fecha límite para solicitar la garantía (15 días después de resultados)
- `{PORCENTAJE_CUMPLIMIENTO}`: Porcentaje de cumplimiento actual del estudiante
- `{SIMULADORES_COMPLETADOS}`: Número de simuladores completados vs. total
- `{PROMEDIO_SIMULADORES}`: Promedio actual en simuladores
- `{URL_POLITICAS}`: URL actualizada de las políticas completas de garantía

## Datos para IA

- La garantía solo aplica para cursos de preparación de examen de admisión a la UABC
- El estudiante debe demostrar que no fue admitido con documentación oficial
- Los requisitos de la garantía están diseñados para asegurar que el estudiante se preparó adecuadamente
- La plataforma guarda registro automático del cumplimiento de requisitos de cada estudiante
- El reembolso se realiza por el mismo medio de pago que utilizó el estudiante
- Si el estudiante elige un nuevo curso, la garantía no aplica por segunda vez
- La garantía no cubre casos donde el estudiante no se presentó al examen
- Para aplicar la garantía, el estudiante debe haber pagado el curso completo (no aplica a becas o descuentos del 100%)

## Flujo de Conversación

1. Si el usuario pregunta información general sobre la garantía, enviar Respuesta 1
2. Si el usuario pregunta por los requisitos específicos, enviar Respuesta 2
3. Si el usuario quiere saber cómo solicitar la garantía, enviar Respuesta 3
4. Si el usuario pregunta si cumple con los requisitos, verificar su porcentaje de cumplimiento antes de responder
5. Para casos especiales o excepciones, recopilar información y escalar al equipo de atención al cliente 