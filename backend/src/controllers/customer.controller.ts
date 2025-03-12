import { Request, Response } from 'express';
import { 
  getAllCustomers, 
  getCustomer, 
  createNewCustomer, 
  updateCustomerData 
} from '../services/customer.service';
import { supabase } from '../config/supabase';

// Obtener todos los clientes
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

// Obtener un cliente por ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await getCustomer(id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.status(200).json(customer);
  } catch (error) {
    console.error(`Error al obtener cliente ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
};

// Obtener el ID de Supabase para un cliente de Airtable
export const getSupabaseCustomerId = async (req: Request, res: Response) => {
  try {
    const { airtableId } = req.params;
    
    // Verificar que el cliente existe en Airtable
    const customer = await getCustomer(airtableId);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado en Airtable' });
    }
    
    // Buscar el cliente en Supabase
    const { data, error } = await supabase
      .from('customers')
      .select('id')
      .eq('airtable_id', airtableId)
      .single();
    
    if (error || !data) {
      // Si no existe, intentar crearlo
      console.log(`Cliente ${airtableId} no encontrado en Supabase. Creando...`);
      
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert([
          {
            airtable_id: airtableId,
            phone: customer.phone,
            name: customer.name,
            email: customer.email || '',
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
          details: createError?.message
        });
      }
      
      return res.status(200).json({ supabaseId: newCustomer.id });
    }
    
    return res.status(200).json({ supabaseId: data.id });
  } catch (error) {
    console.error(`Error al obtener ID de Supabase para ${req.params.airtableId}:`, error);
    res.status(500).json({ error: 'Error al obtener ID de Supabase' });
  }
};

// Crear un nuevo cliente
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { phone, name, email, notes, status } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'El teléfono es obligatorio' });
    }
    
    const newCustomer = await createNewCustomer({
      phone,
      name: name || '',
      email: email || '',
      status: status || 'activo'
    });
    
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

// Actualizar un cliente
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, status, city, gender, examType, aspirantTo, group } = req.body;
    
    const customer = await getCustomer(id);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const updatedCustomer = await updateCustomerData(id, {
      name,
      email,
      status,
      city,
      gender,
      examType,
      aspirantTo,
      group
    });
    
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(`Error al actualizar cliente ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
}; 