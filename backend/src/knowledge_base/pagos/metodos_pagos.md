# Métodos de Pago y Preguntas Frecuentes

## Patrones de Detección

- "cómo pagar"
- "métodos de pago"
- "transferencia bancaria"
- "pago con tarjeta"
- "depósito oxxo"
- "plan de pagos"
- "mensualidades"
- "descuento por pago"
- "factura"
- "comprobante de pago"

## Respuestas Predeterminadas

### Respuesta 1: Métodos de Pago Disponibles

```
💳 Métodos de Pago Disponibles 💰

En Superfy aceptamos diversos métodos de pago para tu comodidad:

1️⃣ *Depósito o transferencia bancaria*
   - Banco: BBVA
   - Titular: Superfy Consultoría Educativa S.A. de C.V.
   - Cuenta: 0112233445
   - CLABE: 012028001122334455

2️⃣ *Pago en efectivo*
   - En nuestras oficinas de Zona Río
   - Depósito en OXXO (solicita tarjeta para depósito)

3️⃣ *Pago con tarjeta*
   - Tarjetas de crédito o débito (Visa/Mastercard)
   - Pago en línea a través de nuestra plataforma
   - Terminal en nuestras oficinas

4️⃣ *Pago a plazos*
   - Sin intereses, según el plan elegido
   - Se firma acuerdo de pagos
   - Fechas fijas para pagos mensuales

Después de realizar tu pago, envía tu comprobante por WhatsApp para registrarlo en nuestro sistema.
```

### Respuesta 2: Proceso para Realizar Pagos

```
🔄 Proceso para Realizar Pagos 🔄

Para completar tu pago y registrarlo correctamente, sigue estos pasos:

1️⃣ *Para pago por transferencia/depósito:*
   - Realiza la transferencia a nuestra cuenta bancaria
   - Toma captura de pantalla o foto del comprobante
   - Envía el comprobante por WhatsApp con tu nombre completo
   - Guarda el comprobante original para cualquier aclaración

2️⃣ *Para pago en efectivo en oficinas:*
   - Visítanos en horario de lunes a viernes de 9am a 7pm o sábados de 9am a 2pm
   - Solicita tu recibo oficial al momento del pago
   - El pago se registrará inmediatamente en el sistema

3️⃣ *Para pago con tarjeta en línea:*
   - Ingresa a tu perfil en www.superfy.pro
   - Selecciona "Realizar pago"
   - Sigue las instrucciones para completar el pago seguro
   - El sistema generará un recibo automáticamente

⚠️ *IMPORTANTE*: Todos los pagos deben ser registrados para activar o mantener activo tu acceso al curso.
```

### Respuesta 3: Planes de Pago y Facturación

```
📆 Planes de Pago y Facturación 📃

*Planes de pago disponibles:*

1️⃣ *Pago único*: Aprovecha nuestros descuentos por pago total anticipado:
   - Curso Áreas de la Salud: $9,000 (ahorro de $3,500)
   - Curso Enero: $6,200 (ahorro de $2,200)
   - Curso Intensivo: $5,800 (pago en 2 exhibiciones)
   - Curso Online: $2,400 (ahorro de $600)

2️⃣ *Pagos parciales*:
   - Curso Áreas de la Salud: 5 pagos de $2,500
   - Curso Enero: 3 pagos de $2,800
   - Curso Intensivo: 4 pagos de $1,700
   - Curso Online: 2 pagos de $1,500

*Proceso de facturación:*
Si requieres factura, proporciona los siguientes datos:
   - Razón social
   - RFC
   - Uso de CFDI
   - Método de pago (según catálogo SAT)
   - Correo electrónico para envío

Las facturas se emiten dentro de los primeros 5 días del mes siguiente al pago.
```

### Respuesta 4: Preguntas Frecuentes sobre Pagos

```
❓ Preguntas Frecuentes sobre Pagos ❓

*¿Hay cargos adicionales por pagar a plazos?*
No, nuestros planes de pago no generan intereses ni cargos extra.

*¿Qué sucede si me retraso en un pago?*
Se te notificará por WhatsApp. Si el retraso supera los 10 días, el acceso a la plataforma podría ser suspendido temporalmente hasta regularizar el pago.

*¿Puedo cambiar mi plan de pagos una vez iniciado?*
Sí, puedes cambiar a un plan de menos pagos en cualquier momento. Para hacerlo, comunícate con nuestro equipo administrativo.

*¿Ofrecen descuentos adicionales?*
Además de los descuentos por pago único, ofrecemos:
- 10% de descuento a hermanos que se inscriban juntos
- 5% de descuento a ex-alumnos
- Programa de becas para casos especiales

*¿Cómo solicito un reembolso?*
Las políticas de reembolso aplican sólo en casos específicos según nuestros términos y condiciones. Cada solicitud se evalúa individualmente.
```

## Variables Dinámicas

- `{DESCUENTO_PAGO_UNICO}`: Cantidad de descuento por pago único según el curso
- `{PLAN_PAGOS_PERSONALIZADO}`: Detalles del plan de pagos específico del estudiante
- `{FECHA_LIMITE_PROXIMO_PAGO}`: Próxima fecha límite de pago para el estudiante
- `{DATOS_CUENTA_BANCARIA}`: Datos actualizados de cuenta bancaria para depósitos
- `{MONTO_PENDIENTE}`: Cantidad pendiente por pagar en el curso del estudiante

## Datos para IA

- Los pagos deben ser reportados vía WhatsApp para su correcto registro
- La inscripción inicial de $500 (cursos presenciales) o $200 (curso en línea) es obligatoria para reservar lugar
- Los pagos subsecuentes tienen fechas específicas acordadas al inicio del curso
- Se recomienda guardar todos los comprobantes de pago hasta finalizar el curso
- Los pagos realizados después de las 6pm podrían ser registrados hasta el siguiente día hábil
- La cuenta bancaria para depósitos es exclusiva para pagos de cursos
- Los estudiantes pueden solicitar un estado de cuenta de sus pagos en cualquier momento
- Si un estudiante tiene dificultades para cumplir con el plan de pagos, debe comunicarlo antes de la fecha límite

## Flujo de Conversación

1. Si el usuario pregunta por métodos de pago, enviar Respuesta 1
2. Si el usuario pregunta cómo realizar un pago, enviar Respuesta 2
3. Si el usuario solicita información sobre planes de pago o facturación, enviar Respuesta 3
4. Si el usuario tiene preguntas específicas sobre pagos, enviar Respuesta 4
5. Si el usuario reporta un pago, solicitar comprobante y confirmar recepción
6. Si el usuario presenta problemas específicos con pagos, escalar al equipo administrativo 