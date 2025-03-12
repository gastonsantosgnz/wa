-- Tabla para clientes (sincronizada con Airtable)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  airtable_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL,
  city TEXT,
  gender TEXT,
  profile_picture TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  exam_type TEXT,
  aspirant_to TEXT,
  group_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(airtable_id),
  UNIQUE(phone)
);

-- Crear índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_airtable_id ON customers(airtable_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Tabla para mensajes
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('sent', 'received')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  UNIQUE(message_id)
);

-- Crear índices para búsquedas comunes en mensajes
CREATE INDEX IF NOT EXISTS idx_messages_customer_id ON messages(customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_message_id ON messages(message_id);

-- Función para actualizar automáticamente el campo 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar 'updated_at' en clientes
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Activar realtime para las tablas
ALTER TABLE customers REPLICA IDENTITY FULL;
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Políticas de seguridad (ajustar según necesidades)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Permitir acceso anónimo a todos los registros (para desarrollo)
-- En producción, esto debería ser más restrictivo
CREATE POLICY "Allow anonymous read access to customers"
  ON customers FOR SELECT
  USING (true);

CREATE POLICY "Allow anonymous read access to messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Allow anonymous insert to messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert to customers"
  ON customers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update to customers"
  ON customers FOR UPDATE
  USING (true);

-- Opcional: Crear vista para juntar mensajes con información de clientes
CREATE OR REPLACE VIEW messages_with_customer AS
SELECT 
  m.id,
  m.message_id,
  m.customer_id,
  m.direction,
  m.content,
  m.timestamp,
  m.status,
  c.name as customer_name,
  c.phone as customer_phone,
  c.email as customer_email,
  c.status as customer_status
FROM messages m
JOIN customers c ON m.customer_id = c.id
ORDER BY m.timestamp DESC; 