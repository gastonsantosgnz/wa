'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiBell, FiUser } from 'react-icons/fi'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
            WhatsApp CRM
          </Link>
        </div>
        
        {/* Espacio flexible para mantener el layout */}
        <div className="flex-1 mx-6">
          {/* Espacio vacío donde estaba la búsqueda */}
        </div>
        
        {/* Acciones */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiBell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
            <FiUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  )
} 