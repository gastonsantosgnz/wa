'use client'

import { useEffect, useState } from 'react'
import { Customer } from '@/utils/api'
import Dashboard from '@/components/Dashboard'
import { customerApi } from '@/utils/api'

export default function Home() {
  // Estado para almacenar clientes y el cliente seleccionado
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar clientes al iniciar
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const data = await customerApi.getAll()
        setCustomers(data)
        
        // Seleccionar el primer cliente por defecto si existe
        if (data.length > 0 && !selectedCustomer) {
          setSelectedCustomer(data[0])
        }
        
        setError(null)
      } catch (err) {
        console.error('Error al cargar clientes:', err)
        setError('No se pudieron cargar los clientes. Intente de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Función para seleccionar un cliente
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  // Función para actualizar un cliente
  const handleUpdateCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      const updatedCustomer = await customerApi.update(id, data)
      
      // Actualizar la lista de clientes
      setCustomers(customers.map(c => 
        c.id === id ? updatedCustomer : c
      ))
      
      // Si el cliente actualizado es el seleccionado, actualizarlo
      if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer(updatedCustomer)
      }
      
      return true
    } catch (err) {
      console.error('Error al actualizar cliente:', err)
      return false
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl">Cargando...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      ) : (
        <Dashboard 
          customers={customers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={handleSelectCustomer}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}
    </main>
  )
} 