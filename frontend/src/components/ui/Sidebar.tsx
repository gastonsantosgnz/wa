'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiMessageCircle, 
  FiUsers, 
  FiPieChart, 
  FiSettings,
  FiBarChart2,
  FiBook
} from 'react-icons/fi'

export default function Sidebar() {
  const pathname = usePathname()
  
  // Elementos de la barra lateral
  const sidebarItems = [
    {
      name: 'Chats',
      href: '/',
      icon: FiMessageCircle
    },
    {
      name: 'Clientes',
      href: '/customers',
      icon: FiUsers
    },
    {
      name: 'Pipeline',
      href: '/pipeline',
      icon: FiBarChart2
    },
    {
      name: 'Base de Conocimiento',
      href: '/knowledge',
      icon: FiBook
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: FiPieChart
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: FiSettings
    }
  ]
  
  return (
    <aside className="w-16 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center py-4">
      {sidebarItems.map(item => (
        <Link
          key={item.name}
          href={item.href}
          className={`w-10 h-10 mb-4 flex items-center justify-center rounded-lg ${
            pathname === item.href
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
          title={item.name}
        >
          <item.icon className="h-5 w-5" />
        </Link>
      ))}
    </aside>
  )
} 