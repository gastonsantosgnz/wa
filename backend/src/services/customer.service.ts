import { base, CUSTOMERS_TABLE } from '../config/airtable';
import { supabase } from '../config/supabase';
import { 
  Customer, 
  CustomerInput, 
  CustomerUpdate 
} from '../models/customer.model';

// Mapeo de campos entre nuestra aplicación y Airtable
const fieldMapping = {
  phone: 'Celular',
  name: 'Usuario',
  email: 'Correo electrónico',
  status: 'Estatus',
  city: 'Ciudad',
  gender: 'Género',
  profilePicture: 'Foto perfil',
  emergencyContact: 'contactoEmergencia',
  emergencyPhone: 'celEmergencia',
  examType: 'Tipo de examen',
  aspirantTo: 'Aspirante a',
  group: 'Grupo',
  intentos2024: 'intentos2024',
  verified: 'Verificado',
  configured: 'Configurado',
  createdAt: 'Fecha de creación'
  // No hay campo updatedAt en Airtable
};

// Obtener todos los clientes
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    // Primero buscamos en Airtable
    const records = await base(CUSTOMERS_TABLE).select().all();
    
    return records.map(record => ({
      id: record.id,
      phone: record.get(fieldMapping.phone) as string || '',
      name: record.get(fieldMapping.name) as string || '',
      email: record.get(fieldMapping.email) as string || '',
      status: record.get(fieldMapping.status) as Customer['status'] || 'activo',
      city: record.get(fieldMapping.city) as string || '',
      gender: record.get(fieldMapping.gender) as string || '',
      profilePicture: record.get(fieldMapping.profilePicture) as string || '',
      emergencyContact: record.get(fieldMapping.emergencyContact) as string || '',
      emergencyPhone: record.get(fieldMapping.emergencyPhone) as string || '',
      examType: record.get(fieldMapping.examType) as string || '',
      aspirantTo: record.get(fieldMapping.aspirantTo) as string || '',
      group: record.get(fieldMapping.group) as string || '',
      intentos2024: record.get(fieldMapping.intentos2024) as Record<string, any> || undefined,
      verified: record.get(fieldMapping.verified) as boolean || false,
      configured: record.get(fieldMapping.configured) as boolean || false,
      createdAt: record.get(fieldMapping.createdAt) ? new Date(record.get(fieldMapping.createdAt) as string) : new Date(),
      updatedAt: new Date() // Usamos la fecha actual
    }));
  } catch (error) {
    console.error('Error al obtener clientes de Airtable:', error);
    throw error;
  }
};

// Obtener un cliente específico por ID
export const getCustomer = async (id: string): Promise<Customer | null> => {
  try {
    const record = await base(CUSTOMERS_TABLE).find(id);
    
    if (!record) {
      return null;
    }
    
    return {
      id: record.id,
      phone: record.get(fieldMapping.phone) as string || '',
      name: record.get(fieldMapping.name) as string || '',
      email: record.get(fieldMapping.email) as string || '',
      status: record.get(fieldMapping.status) as Customer['status'] || 'activo',
      city: record.get(fieldMapping.city) as string || '',
      gender: record.get(fieldMapping.gender) as string || '',
      profilePicture: record.get(fieldMapping.profilePicture) as string || '',
      emergencyContact: record.get(fieldMapping.emergencyContact) as string || '',
      emergencyPhone: record.get(fieldMapping.emergencyPhone) as string || '',
      examType: record.get(fieldMapping.examType) as string || '',
      aspirantTo: record.get(fieldMapping.aspirantTo) as string || '',
      group: record.get(fieldMapping.group) as string || '',
      intentos2024: record.get(fieldMapping.intentos2024) as Record<string, any> || undefined,
      verified: record.get(fieldMapping.verified) as boolean || false,
      configured: record.get(fieldMapping.configured) as boolean || false,
      createdAt: record.get(fieldMapping.createdAt) ? new Date(record.get(fieldMapping.createdAt) as string) : new Date(),
      updatedAt: new Date() // Usamos la fecha actual
    };
  } catch (error) {
    console.error(`Error al obtener cliente ${id} de Airtable:`, error);
    throw error;
  }
};

// Obtener un cliente por número de teléfono
export const getCustomerByPhone = async (phone: string): Promise<Customer | null> => {
  try {
    const records = await base(CUSTOMERS_TABLE)
      .select({ filterByFormula: `{${fieldMapping.phone}} = '${phone}'` })
      .all();
    
    if (records.length === 0) {
      return null;
    }
    
    const record = records[0];
    
    return {
      id: record.id,
      phone: record.get(fieldMapping.phone) as string || '',
      name: record.get(fieldMapping.name) as string || '',
      email: record.get(fieldMapping.email) as string || '',
      status: record.get(fieldMapping.status) as Customer['status'] || 'activo',
      city: record.get(fieldMapping.city) as string || '',
      gender: record.get(fieldMapping.gender) as string || '',
      profilePicture: record.get(fieldMapping.profilePicture) as string || '',
      emergencyContact: record.get(fieldMapping.emergencyContact) as string || '',
      emergencyPhone: record.get(fieldMapping.emergencyPhone) as string || '',
      examType: record.get(fieldMapping.examType) as string || '',
      aspirantTo: record.get(fieldMapping.aspirantTo) as string || '',
      group: record.get(fieldMapping.group) as string || '',
      intentos2024: record.get(fieldMapping.intentos2024) as Record<string, any> || undefined,
      verified: record.get(fieldMapping.verified) as boolean || false,
      configured: record.get(fieldMapping.configured) as boolean || false,
      createdAt: record.get(fieldMapping.createdAt) ? new Date(record.get(fieldMapping.createdAt) as string) : new Date(),
      updatedAt: new Date() // Usamos la fecha actual
    };
  } catch (error) {
    console.error(`Error al buscar cliente por teléfono ${phone}:`, error);
    throw error;
  }
};

// Crear un nuevo cliente
export const createNewCustomer = async (customer: CustomerInput): Promise<Customer> => {
  try {
    const now = new Date().toISOString();
    
    // Preparar los campos para Airtable según nuestro mapeo
    const fields: Record<string, any> = {};
    
    fields[fieldMapping.phone] = customer.phone;
    fields[fieldMapping.name] = customer.name;
    fields[fieldMapping.email] = customer.email || '';
    fields[fieldMapping.status] = customer.status || 'activo';
    // No enviamos fecha de creación ya que es un campo computado en Airtable
    
    // Campos opcionales
    if (customer.city) fields[fieldMapping.city] = customer.city;
    if (customer.gender) fields[fieldMapping.gender] = customer.gender;
    if (customer.profilePicture) fields[fieldMapping.profilePicture] = customer.profilePicture;
    if (customer.emergencyContact) fields[fieldMapping.emergencyContact] = customer.emergencyContact;
    if (customer.emergencyPhone) fields[fieldMapping.emergencyPhone] = customer.emergencyPhone;
    if (customer.examType) fields[fieldMapping.examType] = customer.examType;
    if (customer.aspirantTo) fields[fieldMapping.aspirantTo] = customer.aspirantTo;
    if (customer.group) fields[fieldMapping.group] = customer.group;
    
    // Crear en Airtable
    const records = await base(CUSTOMERS_TABLE).create([
      { fields }
    ]);
    
    const record = records[0];
    
    // También vamos a crear el cliente en Supabase para el pipeline
    await supabase
      .from('customers')
      .insert([
        {
          airtable_id: record.id,
          phone: customer.phone,
          name: customer.name,
          email: customer.email,
          status: customer.status || 'activo',
          city: customer.city,
          gender: customer.gender,
          profile_picture: customer.profilePicture,
          emergency_contact: customer.emergencyContact,
          emergency_phone: customer.emergencyPhone,
          exam_type: customer.examType,
          aspirant_to: customer.aspirantTo,
          group: customer.group,
          created_at: now,
          updated_at: now
        }
      ]);
    
    return {
      id: record.id,
      phone: record.get(fieldMapping.phone) as string || '',
      name: record.get(fieldMapping.name) as string || '',
      email: record.get(fieldMapping.email) as string || '',
      status: record.get(fieldMapping.status) as Customer['status'] || 'activo',
      city: record.get(fieldMapping.city) as string || '',
      gender: record.get(fieldMapping.gender) as string || '',
      profilePicture: record.get(fieldMapping.profilePicture) as string || '',
      emergencyContact: record.get(fieldMapping.emergencyContact) as string || '',
      emergencyPhone: record.get(fieldMapping.emergencyPhone) as string || '',
      examType: record.get(fieldMapping.examType) as string || '',
      aspirantTo: record.get(fieldMapping.aspirantTo) as string || '',
      group: record.get(fieldMapping.group) as string || '',
      intentos2024: record.get(fieldMapping.intentos2024) as Record<string, any> || undefined,
      verified: record.get(fieldMapping.verified) as boolean || false,
      configured: record.get(fieldMapping.configured) as boolean || false,
      createdAt: new Date(now),
      updatedAt: new Date(now)
    };
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }
};

// Actualizar un cliente existente
export const updateCustomerData = async (id: string, data: CustomerUpdate): Promise<Customer> => {
  try {
    const now = new Date().toISOString();
    
    // Primero obtener los datos actuales
    const currentData = await getCustomer(id);
    
    if (!currentData) {
      throw new Error(`Cliente con ID ${id} no encontrado`);
    }
    
    // Preparar campos a actualizar
    const fields: Record<string, any> = {};
    // No enviamos updatedAt a Airtable
    
    if (data.name !== undefined) fields[fieldMapping.name] = data.name;
    if (data.email !== undefined) fields[fieldMapping.email] = data.email;
    if (data.status !== undefined) fields[fieldMapping.status] = data.status;
    if (data.city !== undefined) fields[fieldMapping.city] = data.city;
    if (data.gender !== undefined) fields[fieldMapping.gender] = data.gender;
    if (data.profilePicture !== undefined) fields[fieldMapping.profilePicture] = data.profilePicture;
    if (data.emergencyContact !== undefined) fields[fieldMapping.emergencyContact] = data.emergencyContact;
    if (data.emergencyPhone !== undefined) fields[fieldMapping.emergencyPhone] = data.emergencyPhone;
    if (data.examType !== undefined) fields[fieldMapping.examType] = data.examType;
    if (data.aspirantTo !== undefined) fields[fieldMapping.aspirantTo] = data.aspirantTo;
    if (data.group !== undefined) fields[fieldMapping.group] = data.group;
    
    // Actualizar en Airtable
    const records = await base(CUSTOMERS_TABLE).update([
      {
        id,
        fields
      }
    ]);
    
    const record = records[0];
    
    // Preparar datos para actualizar en Supabase
    const supabaseData: Record<string, any> = {
      updated_at: now
    };
    
    if (data.name !== undefined) supabaseData.name = data.name;
    if (data.email !== undefined) supabaseData.email = data.email;
    if (data.status !== undefined) supabaseData.status = data.status;
    if (data.city !== undefined) supabaseData.city = data.city;
    if (data.gender !== undefined) supabaseData.gender = data.gender;
    if (data.profilePicture !== undefined) supabaseData.profile_picture = data.profilePicture;
    if (data.emergencyContact !== undefined) supabaseData.emergency_contact = data.emergencyContact;
    if (data.emergencyPhone !== undefined) supabaseData.emergency_phone = data.emergencyPhone;
    if (data.examType !== undefined) supabaseData.exam_type = data.examType;
    if (data.aspirantTo !== undefined) supabaseData.aspirant_to = data.aspirantTo;
    if (data.group !== undefined) supabaseData.group = data.group;
    
    // También actualizar en Supabase
    await supabase
      .from('customers')
      .update(supabaseData)
      .eq('airtable_id', id);
    
    return {
      id: record.id,
      phone: record.get(fieldMapping.phone) as string || '',
      name: record.get(fieldMapping.name) as string || '',
      email: record.get(fieldMapping.email) as string || '',
      status: record.get(fieldMapping.status) as Customer['status'] || 'activo',
      city: record.get(fieldMapping.city) as string || '',
      gender: record.get(fieldMapping.gender) as string || '',
      profilePicture: record.get(fieldMapping.profilePicture) as string || '',
      emergencyContact: record.get(fieldMapping.emergencyContact) as string || '',
      emergencyPhone: record.get(fieldMapping.emergencyPhone) as string || '',
      examType: record.get(fieldMapping.examType) as string || '',
      aspirantTo: record.get(fieldMapping.aspirantTo) as string || '',
      group: record.get(fieldMapping.group) as string || '',
      intentos2024: record.get(fieldMapping.intentos2024) as Record<string, any> || undefined,
      verified: record.get(fieldMapping.verified) as boolean || false,
      configured: record.get(fieldMapping.configured) as boolean || false,
      createdAt: currentData.createdAt,
      updatedAt: new Date(now)
    };
  } catch (error) {
    console.error(`Error al actualizar cliente ${id}:`, error);
    throw error;
  }
};

// Buscar o crear un cliente por número de teléfono
export const findOrCreateCustomer = async (phone: string, name?: string): Promise<Customer> => {
  try {
    // Buscar si el cliente ya existe
    const existingCustomer = await getCustomerByPhone(phone);
    
    // Si existe, retornarlo
    if (existingCustomer) {
      return existingCustomer;
    }
    
    // Si no existe, crearlo
    return await createNewCustomer({
      phone,
      name: name || phone, // Si no hay nombre, usar el teléfono
      status: 'activo'
    });
  } catch (error) {
    console.error(`Error al buscar o crear cliente con teléfono ${phone}:`, error);
    throw error;
  }
}; 