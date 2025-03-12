import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Verificar la variable de entorno
const apiKey = process.env.OPENAI_API_KEY;

// Validar que la variable de entorno esté definida
if (!apiKey) {
  throw new Error('OPENAI_API_KEY es requerido');
}

// Crear y exportar el cliente de OpenAI
export const openai = new OpenAI({
  apiKey: apiKey
}); 