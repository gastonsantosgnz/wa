import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook.routes';
import customerRoutes from './routes/customer.routes';
import messageRoutes from './routes/message.routes';
import knowledgeRoutes from './routes/knowledge.routes';

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/webhook', webhookRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/knowledge', knowledgeRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'WhatsApp CRM API is running' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 