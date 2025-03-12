'use client'

import { useState } from 'react'
import { Customer } from '@/utils/api'
import { FiSearch, FiPlus } from 'react-icons/fi'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ChatListProps {
  customers: Customer[]
  selectedCustomer: Customer | null
  onSelectCustomer: (customer: Customer) => void
}

export default function ChatList({
  customers,
  selectedCustomer,
  onSelectCustomer
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filtrar clientes según el término de búsqueda
  const filteredCustomers = searchTerm
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
    : customers
  
  return (
    <div className="flex flex-col h-full">
      {/* Cabecera */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3">Chats</h2>
        
        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar chat..."
            className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      
      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className={`p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                selectedCustomer?.id === customer.id
                  ? 'bg-primary-50 dark:bg-primary-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => onSelectCustomer(customer)}
            >
              <div className="flex items-center">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center dark:bg-primary-900/50">
                  <span className="text-primary-600 dark:text-primary-300 font-medium text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                {/* Información del cliente */}
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium truncate dark:text-gray-200">
                      {customer.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(customer.updatedAt), 'HH:mm', { locale: es })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {customer.phone}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No se encontraron chats
            </p>
            {searchTerm && (
              <button
                className="text-primary-600 dark:text-primary-400"
                onClick={() => setSearchTerm('')}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Botón para nuevo chat */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 transition duration-200">
          <FiPlus className="mr-2" />
          Nuevo chat
        </button>
      </div>
    </div>
  )
}

// Función para obtener el color del badge según el estado
function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'nuevo':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'contactado':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'calificado':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    case 'negociación':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'ganado':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'perdido':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
} 