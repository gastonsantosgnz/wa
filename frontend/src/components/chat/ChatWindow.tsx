'use client'

import { useState, useEffect, useRef } from 'react'
import { Customer, Message, messageApi } from '@/utils/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FiSend, FiUser, FiPaperclip, FiInfo } from 'react-icons/fi'
import { subscribeToMessages } from '@/lib/supabase'

interface ChatWindowProps {
  customer: Customer
  onShowProfile: () => void
  showProfile: boolean
}

export default function ChatWindow({
  customer,
  onShowProfile,
  showProfile
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Cargar mensajes al cambiar de cliente
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        console.log(`Cargando mensajes para el cliente: ${customer.id}`);
        const data = await messageApi.getByCustomer(customer.id);
        console.log(`Mensajes cargados: ${data.length}`);
        setMessages(data);
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Suscribirse a cambios en tiempo real
    console.log(`Suscribiéndose a cambios en mensajes para el cliente: ${customer.id}`);
    
    // Primero necesitamos obtener el UUID de Supabase para este cliente de Airtable
    const getSupabaseCustomerId = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/supabase-id/${customer.id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.supabaseId;
      } catch (error) {
        console.error('Error al obtener ID de Supabase:', error);
        // Fallback: usar directamente el ID de Airtable para la suscripción
        // (no ideal pero al menos intentamos suscribirnos a algo)
        return customer.id;
      }
    };
    
    getSupabaseCustomerId().then(supabaseCustomerId => {
      console.log(`ID de Supabase para el cliente: ${supabaseCustomerId}`);
      
      const subscription = subscribeToMessages(supabaseCustomerId, (payload) => {
        console.log('Nuevo evento de mensaje recibido:', payload);
        const { eventType, new: newRecord } = payload;
        
        if (eventType === 'INSERT') {
          // Convertir formato de Supabase a formato de la API
          const newMessage: Message = {
            id: newRecord.id,
            messageId: newRecord.message_id,
            customerId: newRecord.customer_id,
            direction: newRecord.direction,
            content: newRecord.content,
            timestamp: newRecord.timestamp,
            status: newRecord.status
          };
          
          console.log('Nuevo mensaje añadido a la conversación:', newMessage);
          setMessages(prev => [...prev, newMessage]);
        }
      });
      
      // Limpiar suscripción al desmontar
      return () => {
        console.log('Cancelando suscripción a mensajes');
        subscription.unsubscribe();
      };
    });
  }, [customer.id]);
  
  // Scroll al último mensaje cuando se añaden nuevos
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  
  // Manejar envío de mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return
    
    try {
      setSending(true)
      
      // Mostrar el mensaje en la UI inmediatamente (optimistic UI)
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        messageId: `temp-${Date.now()}`,
        customerId: customer.id,
        direction: 'sent',
        content: newMessage,
        timestamp: new Date().toISOString(),
        status: 'sent'
      }
      
      // Agregar el mensaje temporal a la lista
      setMessages(prev => [...prev, tempMessage])
      
      // Limpiar el campo de mensaje
      setNewMessage('')
      
      // Enviar el mensaje al servidor
      try {
        await messageApi.send(customer.id, newMessage)
        console.log('Mensaje enviado con éxito')
      } catch (error: any) {
        console.error('Error al enviar mensaje:', error)
        
        // Mostrar mensaje de error más detallado
        let errorMessage = 'No se pudo enviar el mensaje.'
        
        if (error.response) {
          // La solicitud fue hecha y el servidor respondió con un código de estado
          // que está fuera del rango 2xx
          console.error('Error de respuesta:', error.response.data)
          console.error('Código de estado:', error.response.status)
          errorMessage = `Error ${error.response.status}: ${
            error.response.data?.error || error.response.data?.message || 'Error en el servidor'
          }`
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          errorMessage = 'No se recibió respuesta del servidor'
        } else {
          // Algo sucedió al configurar la solicitud
          errorMessage = error.message || 'Error desconocido'
        }
        
        alert(`Error al enviar mensaje: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error general al enviar mensaje:', error)
    } finally {
      setSending(false)
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Cabecera del chat */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center dark:bg-primary-900/50">
            <span className="text-primary-600 dark:text-primary-300 font-medium">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <h3 className="font-medium dark:text-gray-200">{customer.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {customer.phone}
            </p>
          </div>
        </div>
        <button
          onClick={onShowProfile}
          className={`p-2 rounded-full ${
            showProfile 
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300' 
              : 'hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-700 dark:text-gray-400'
          }`}
          title="Ver perfil"
        >
          <FiInfo className="w-5 h-5" />
        </button>
      </div>
      
      {/* Ventana de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
        {loading ? (
          <div className="flex justify-center p-4">
            <p className="text-gray-500 dark:text-gray-400">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <FiUser className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="font-medium mb-1 dark:text-gray-300">Comienza una conversación</h3>
            <p className="text-gray-500 dark:text-gray-400">
              No hay mensajes con {customer.name} todavía
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(message => (
              <div 
                key={message.id}
                className={`flex ${message.direction === 'sent' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.direction === 'sent'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 text-right ${
                    message.direction === 'sent'
                      ? 'text-primary-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {format(new Date(message.timestamp), 'HH:mm', { locale: es })}
                    {message.direction === 'sent' && (
                      <span className="ml-1">
                        {message.status === 'delivered' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Formulario para enviar mensajes */}
      <form 
        onSubmit={handleSendMessage}
        className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center"
      >
        <button
          type="button"
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 mx-3 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className={`p-2 rounded-full ${
            sending || !newMessage.trim()
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
} 