# WhatsApp CRM + IA

Un sistema CRM integrado con WhatsApp Business Cloud API que utiliza inteligencia artificial (OpenAI), Airtable para gestión de clientes y Supabase para almacenamiento y visualización de mensajes en tiempo real.

## Características principales

- Envío y recepción de mensajes de WhatsApp en tiempo real
- Integración con GPT-4 para respuestas automáticas inteligentes
- Gestión de clientes y pipeline de ventas
- Almacenamiento de conversaciones en tiempo real
- Panel de análisis de conversaciones y métricas

## Estructura del proyecto

El proyecto está dividido en dos partes principales:

### Backend (Node.js, Express, TypeScript)

```
backend/
├── src/
│   ├── config/      # Configuración de servicios externos
│   ├── controllers/ # Controladores para las rutas
│   ├── middleware/  # Middlewares de Express
│   ├── models/      # Definición de tipos y modelos
│   ├── routes/      # Rutas de la API
│   └── services/    # Servicios para lógica de negocio
├── .env.example     # Ejemplo de variables de entorno
├── package.json     # Dependencias y scripts
└── tsconfig.json    # Configuración de TypeScript
```

### Frontend (Next.js, TypeScript, TailwindCSS)

```
frontend/
├── src/
│   ├── app/         # Rutas de Next.js App Router
│   ├── components/  # Componentes de React
│   │   ├── chat/    # Componentes para el chat
│   │   ├── customer/ # Componentes para el perfil de cliente
│   │   └── pipeline/ # Componentes para el pipeline
│   ├── lib/         # Utilidades y configuración
│   ├── utils/       # Funciones utilitarias
│   └── styles/      # Estilos globales
├── .env.example     # Ejemplo de variables de entorno
├── next.config.js   # Configuración de Next.js
├── package.json     # Dependencias y scripts
└── tailwind.config.js # Configuración de TailwindCSS
```

## Requisitos previos

- Node.js 18 o superior
- Cuenta en WhatsApp Business Platform
- Cuenta en Airtable
- Cuenta en Supabase
- Cuenta en OpenAI (para acceder a la API de GPT-4)

## Configuración

1. Clona este repositorio
2. Configura las variables de entorno (copia `.env.example` a `.env` y completa los valores)
3. Instala las dependencias:

```bash
# Backend
cd whatsapp-crm/backend
npm install

# Frontend
cd whatsapp-crm/frontend
npm install
```

## Desarrollo

```bash
# Backend
cd whatsapp-crm/backend
npm run dev

# Frontend
cd whatsapp-crm/frontend
npm run dev
```

## Despliegue

### Backend

El backend puede ser desplegado en servicios como Railway o Render.

### Frontend

El frontend puede ser desplegado en Vercel.

## Endpoints de la API

### Webhook

- `GET /webhook` - Verificar webhook de WhatsApp
- `POST /webhook` - Recibir mensajes de WhatsApp

### Clientes

- `GET /customers` - Obtener todos los clientes
- `GET /customers/:id` - Obtener cliente por ID
- `POST /customers` - Crear nuevo cliente
- `PUT /customers/:id` - Actualizar cliente

### Mensajes

- `GET /messages` - Obtener todos los mensajes
- `GET /messages/:customerId` - Obtener mensajes por cliente
- `POST /messages/send` - Enviar mensaje

## Licencia

MIT 