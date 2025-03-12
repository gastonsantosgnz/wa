import { Router } from 'express';
import { 
  getMessages, 
  getMessagesByCustomer, 
  sendMessage 
} from '../controllers/message.controller';

const router = Router();

// Obtener todos los mensajes
router.get('/', getMessages);

// Obtener mensajes por cliente
router.get('/:customerId', getMessagesByCustomer);

// Enviar un mensaje
router.post('/send', sendMessage);

export default router; 