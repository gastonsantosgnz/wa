import { Router } from 'express';
import { verifyWebhook, receiveMessage } from '../controllers/webhook.controller';

const router = Router();

// Ruta para verificar el webhook (GET)
router.get('/', verifyWebhook);

// Ruta para recibir mensajes de WhatsApp (POST)
router.post('/', receiveMessage);

export default router; 