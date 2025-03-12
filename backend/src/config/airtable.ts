import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

// Verificar las variables de entorno
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

// Validar que las variables de entorno estén definidas
if (!apiKey || !baseId) {
  throw new Error('AIRTABLE_API_KEY y AIRTABLE_BASE_ID son requeridos');
}

// Configurar Airtable
Airtable.configure({ apiKey });

// Crear y exportar la base de Airtable
export const base = Airtable.base(baseId);

// Exportar el nombre de la tabla de clientes
export const CUSTOMERS_TABLE = process.env.AIRTABLE_CUSTOMERS_TABLE || 'Customers'; 