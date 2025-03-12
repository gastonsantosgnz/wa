import { Request, Response } from 'express';
import { 
  getAllMessages, 
  getMessagesByCustomerId, 
  saveMessage 
} from '../services/message.service';
import { sendWhatsAppMessage } from '../services/whatsapp.service';
import { getCustomer } from '../services/customer.service';
import { supabase } from '../config/supabase';

// Obtener todos los mensajes
export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

// Obtener mensajes por cliente
export const getMessagesByCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    
    // Verificar que el cliente existe
    const customer = await getCustomer(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Buscar el UUID correspondiente en Supabase usando el ID de Airtable
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('airtable_id', customerId)
      .single();
    
    if (customerError || !customerData) {
      console.error('Error al buscar cliente en Supabase:', customerError);
      return res.status(404).json({ error: 'Cliente no encontrado en Supabase' });
    }
    
    const supabaseCustomerId = customerData.id;
    const messages = await getMessagesByCustomerId(supabaseCustomerId);
    res.status(200).json(messages);
  } catch (error) {
    console.error(`Error al obtener mensajes del cliente ${req.params.customerId}:`, error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

// Enviar un mensaje
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { customerId, message } = req.body;
    
    console.log(`Recibida solicitud para enviar mensaje al cliente ${customerId}: "${message}"`);
    
    if (!customerId || !message) {
      return res.status(400).json({ 
        error: 'Se requieren tanto el ID del cliente como el mensaje' 
      });
    }
    
    // Verificar que el cliente existe en Airtable
    const customer = await getCustomer(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado en Airtable' });
    }
    
    console.log(`Cliente encontrado en Airtable: ${customer.name}, Teléfono: ${customer.phone}`);
    
    // Buscar el UUID correspondiente en Supabase usando el ID de Airtable
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('airtable_id', customerId)
      .single();
    
    if (customerError || !customerData) {
      console.error('Error al buscar cliente en Supabase:', customerError);
      
      // Si el cliente no existe en Supabase, podríamos crearlo aquí
      console.log('Creando cliente en Supabase...');
      
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert([
          {
            airtable_id: customerId,
            phone: customer.phone,
            name: customer.name,
            email: customer.email,
            status: customer.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (createError || !newCustomer) {
        console.error('Error al crear cliente en Supabase:', createError);
        return res.status(500).json({ 
          error: 'Error al crear cliente en Supabase',
          details: createError?.message || 'Unknown error'
        });
      }
      
      var supabaseCustomerId = newCustomer.id;
    } else {
      var supabaseCustomerId = customerData.id;
    }
    
    console.log(`ID de cliente en Supabase: ${supabaseCustomerId}`);
    
    // Enviar mensaje a través de WhatsApp
    try {
      const messageId = await sendWhatsAppMessage(customer.phone, message);
      
      if (!messageId) {
        return res.status(500).json({ error: 'Error al enviar mensaje: no se obtuvo ID del mensaje' });
      }
      
      // Guardar el mensaje en la base de datos usando el UUID de Supabase
      const savedMessage = await saveMessage({
        messageId,
        customerId: supabaseCustomerId, // Usar el UUID de Supabase aquí
        direction: 'sent',
        content: message,
        timestamp: new Date(),
        status: 'sent'
      });
      
      console.log(`Mensaje enviado y guardado con éxito. ID: ${messageId}`);
      res.status(201).json(savedMessage);
    } catch (whatsappError) {
      console.error('Error detallado de WhatsApp:', whatsappError);
      return res.status(500).json({ 
        error: 'Error al enviar mensaje a través de WhatsApp',
        details: whatsappError.message || 'Sin detalles adicionales'
      });
    }
  } catch (error) {
    console.error('Error general al enviar mensaje:', error);
    res.status(500).json({ 
      error: 'Error al enviar mensaje',
      details: error.message || 'Error en el servidor'
    });
  }
}; 