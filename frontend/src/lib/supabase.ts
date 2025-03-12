import { createClient } from '@supabase/supabase-js';

// Crear el cliente con variables de entorno o valores por defecto para desarrollo
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Faltan variables de entorno para Supabase. El cliente puede no funcionar correctamente.');
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para suscribirse a cambios en tiempo real en mensajes
export const subscribeToMessages = (
  customerId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`messages:${customerId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `customer_id=eq.${customerId}`
      },
      callback
    )
    .subscribe();
};

// Función para suscribirse a cambios en tiempo real en clientes
export const subscribeToCustomers = (callback: (payload: any) => void) => {
  return supabase
    .channel('customers')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'customers'
      },
      callback
    )
    .subscribe();
}; 