import { Router } from 'express';
import { 
  getCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer,
  getSupabaseCustomerId 
} from '../controllers/customer.controller';

const router = Router();

// Obtener todos los clientes
router.get('/', getCustomers);

// Obtener el ID de Supabase para un cliente 
// (debe ir antes de la ruta /:id para evitar conflictos)
router.get('/supabase-id/:airtableId', getSupabaseCustomerId);

// Obtener un cliente por ID
router.get('/:id', getCustomerById);

// Crear un nuevo cliente
router.post('/', createCustomer);

// Actualizar un cliente
router.put('/:id', updateCustomer);

export default router; 