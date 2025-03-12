import axios from 'axios';

// Configurar la URL base
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos de datos
export interface Customer {
  id: string;
  phone: string;
  name: string;
  email?: string;
  status: string;
  city?: string;
  gender?: string;
  profilePicture?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  examType?: string;
  aspirantTo?: string;
  group?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  messageId: string;
  customerId: string;
  direction: 'sent' | 'received';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

// API de clientes
export const customerApi = {
  // Obtener todos los clientes
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get('/api/customers');
    return response.data;
  },
  
  // Obtener un cliente por ID
  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/api/customers/${id}`);
    return response.data;
  },
  
  // Crear un nuevo cliente
  create: async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
    const response = await api.post('/api/customers', customer);
    return response.data;
  },
  
  // Actualizar un cliente
  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put(`/api/customers/${id}`, data);
    return response.data;
  }
};

// API de mensajes
export const messageApi = {
  // Obtener todos los mensajes
  getAll: async (): Promise<Message[]> => {
    const response = await api.get('/api/messages');
    return response.data;
  },
  
  // Obtener mensajes por cliente
  getByCustomer: async (customerId: string): Promise<Message[]> => {
    const response = await api.get(`/api/messages/${customerId}`);
    return response.data;
  },
  
  // Enviar un mensaje
  send: async (customerId: string, message: string): Promise<Message> => {
    const response = await api.post('/api/messages/send', { customerId, message });
    return response.data;
  }
};

export default api; 