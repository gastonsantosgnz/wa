import { supabase } from '../config/supabase';
import { Message, MessageInput } from '../models/message.model';

// Obtener todos los mensajes
export const getAllMessages = async (): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      messageId: item.message_id,
      customerId: item.customer_id,
      direction: item.direction,
      content: item.content,
      timestamp: new Date(item.timestamp),
      status: item.status
    }));
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    throw error;
  }
};

// Obtener mensajes por ID de cliente
export const getMessagesByCustomerId = async (customerId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('customer_id', customerId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      messageId: item.message_id,
      customerId: item.customer_id,
      direction: item.direction,
      content: item.content,
      timestamp: new Date(item.timestamp),
      status: item.status
    }));
  } catch (error) {
    console.error(`Error al obtener mensajes del cliente ${customerId}:`, error);
    throw error;
  }
};

// Guardar un mensaje nuevo
export const saveMessage = async (message: MessageInput): Promise<Message> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          message_id: message.messageId,
          customer_id: message.customerId,
          direction: message.direction,
          content: message.content,
          timestamp: message.timestamp.toISOString(),
          status: message.status
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      messageId: data.message_id,
      customerId: data.customer_id,
      direction: data.direction,
      content: data.content,
      timestamp: new Date(data.timestamp),
      status: data.status
    };
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    throw error;
  }
};

// Actualizar el estado de un mensaje
export const updateMessageStatus = async (messageId: string, status: Message['status']): Promise<Message> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({ status })
      .eq('message_id', messageId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      messageId: data.message_id,
      customerId: data.customer_id,
      direction: data.direction,
      content: data.content,
      timestamp: new Date(data.timestamp),
      status: data.status
    };
  } catch (error) {
    console.error(`Error al actualizar estado del mensaje ${messageId}:`, error);
    throw error;
  }
}; 