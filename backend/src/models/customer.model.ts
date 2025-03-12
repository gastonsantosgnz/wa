// Define los tipos de cliente para la aplicación

export interface Customer {
  id: string;
  phone: string;           // Celular en Airtable
  name: string;            // Usuario en Airtable
  email?: string;          // Correo electrónico en Airtable
  status: CustomerStatus;  // Estatus en Airtable
  city?: string;           // Ciudad en Airtable
  gender?: string;         // Género en Airtable
  profilePicture?: string; // Foto perfil en Airtable
  emergencyContact?: string; // contactoEmergencia en Airtable
  emergencyPhone?: string;   // celEmergencia en Airtable
  examType?: string;       // Tipo de examen en Airtable 
  aspirantTo?: string;     // Aspirante a en Airtable
  group?: string;          // Grupo en Airtable
  intentos2024?: Record<string, any>; // JSON con historial de intentos
  verified?: boolean;      // Campo Verificado en Airtable
  configured?: boolean;    // Campo Configurado en Airtable
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerStatus = 'activo' | 'inactivo' | 'pendiente' | 'suspendido' | 'egresado';

export interface CustomerInput {
  phone: string;
  name: string;
  email?: string;
  status?: CustomerStatus;
  city?: string;
  gender?: string;
  profilePicture?: string; 
  emergencyContact?: string;
  emergencyPhone?: string;
  examType?: string;
  aspirantTo?: string;
  group?: string;
  intentos2024?: Record<string, any>;
  verified?: boolean;
  configured?: boolean;
}

export interface CustomerUpdate {
  name?: string;
  email?: string;
  status?: CustomerStatus;
  city?: string;
  gender?: string;
  profilePicture?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  examType?: string;
  aspirantTo?: string;
  group?: string;
  intentos2024?: Record<string, any>;
  verified?: boolean;
  configured?: boolean;
} 