'use client'

import { useState, ReactNode } from 'react'
import { Customer } from '@/utils/api'
import ChatList from '@/components/chat/ChatList'
import ChatWindow from '@/components/chat/ChatWindow'
import CustomerProfile from '@/components/customer/CustomerProfile'
import Sidebar from '@/components/ui/Sidebar'
import Header from '@/components/ui/Header'
import { usePathname } from 'next/navigation'

interface DashboardProps {
  customers?: Customer[]
  selectedCustomer?: Customer | null
  onSelectCustomer?: (customer: Customer) => void
  onUpdateCustomer?: (id: string, data: Partial<Customer>) => Promise<boolean>
  children?: ReactNode
}

export default function Dashboard({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onUpdateCustomer,
  children
}: DashboardProps) {
  // Estado para manejar la visibilidad del perfil del cliente
  const [showProfile, setShowProfile] = useState(false)
  const pathname = usePathname()
  
  // Verificar si estamos en una ruta de knowledge
  const isKnowledgePage = pathname?.startsWith('/knowledge')
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar con navegación */}
        <Sidebar />
        
        {isKnowledgePage ? (
          // Contenido para páginas de knowledge
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        ) : (
          // Contenido para páginas de chat
          <>
            {/* Lista de chats */}
            <div className="w-1/4 border-r border-gray-200 dark:border-gray-700">
              {customers && onSelectCustomer && (
                <ChatList
                  customers={customers}
                  selectedCustomer={selectedCustomer}
                  onSelectCustomer={onSelectCustomer}
                />
              )}
            </div>
            
            {/* Ventana de chat */}
            <div className={`${showProfile ? 'w-2/4' : 'w-3/4'} flex flex-col`}>
              {selectedCustomer ? (
                <ChatWindow
                  customer={selectedCustomer}
                  onShowProfile={() => setShowProfile(!showProfile)}
                  showProfile={showProfile}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">
                    Selecciona un chat para comenzar
                  </p>
                </div>
              )}
            </div>
            
            {/* Perfil del cliente (condicional) */}
            {showProfile && selectedCustomer && onUpdateCustomer && (
              <div className="w-1/4 border-l border-gray-200 dark:border-gray-700">
                <CustomerProfile
                  customer={selectedCustomer}
                  onUpdateCustomer={onUpdateCustomer}
                  onClose={() => setShowProfile(false)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 