'use client'

import { useState } from 'react'
import { Customer } from '@/utils/api'
import { FiX, FiSave, FiEdit2, FiPhone, FiMail, FiInfo, FiUser, FiMapPin, FiMessageCircle, FiBookOpen, FiTarget } from 'react-icons/fi'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface CustomerProfileProps {
  customer: Customer
  onUpdateCustomer: (id: string, data: Partial<Customer>) => Promise<boolean>
  onClose: () => void
}

export default function CustomerProfile({
  customer,
  onUpdateCustomer,
  onClose
}: CustomerProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email || '',
    status: customer.status,
    city: customer.city || '',
    gender: customer.gender || '',
    examType: customer.examType || '',
    aspirantTo: customer.aspirantTo || '',
    group: customer.group || '',
    emergencyContact: customer.emergencyContact || '',
    emergencyPhone: customer.emergencyPhone || ''
  })
  
  // Status options for the dropdown
  const statusOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'suspendido', label: 'Suspendido' },
    { value: 'egresado', label: 'Egresado' }
  ]
  
  // Género options
  const genderOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' },
    { value: 'prefiero_no_decir', label: 'Prefiero no decir' }
  ]
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setUpdating(true)
      const success = await onUpdateCustomer(customer.id, formData)
      
      if (success) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
    } finally {
      setUpdating(false)
    }
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-medium dark:text-gray-200">Perfil del usuario</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Cerrar"
        >
          <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Profile header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3 dark:bg-primary-900/50">
            {customer.profilePicture ? (
              <img 
                src={customer.profilePicture} 
                alt={customer.name} 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
            <span className="text-primary-600 dark:text-primary-300 font-medium text-2xl">
              {customer.name.charAt(0).toUpperCase()}
            </span>
            )}
          </div>
          
          {!isEditing ? (
            <h2 className="text-xl font-semibold dark:text-gray-200">{customer.name}</h2>
          ) : (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-xl font-semibold text-center border-b border-gray-300 pb-1 focus:outline-none focus:border-primary-500 bg-transparent dark:text-gray-200 dark:border-gray-600"
            />
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Usuario desde {format(new Date(customer.createdAt), 'dd MMMM yyyy', { locale: es })}
          </p>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            
            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Género
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                <option value="">Selecciona un género</option>
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ciudad"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            
            {/* Tipo de Examen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Examen
              </label>
              <input
                type="text"
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                placeholder="Tipo de examen"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            
            {/* Aspirante a */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Aspirante a
              </label>
              <input
                type="text"
                name="aspirantTo"
                value={formData.aspirantTo}
                onChange={handleChange}
                placeholder="Aspirante a"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            
            {/* Grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grupo
              </label>
              <input
                type="text"
                name="group"
                value={formData.group}
                onChange={handleChange}
                placeholder="Grupo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            
            {/* Contacto de Emergencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contacto de Emergencia
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Nombre del contacto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            
            {/* Teléfono de Emergencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono de Emergencia
              </label>
              <input
                type="text"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="Teléfono de emergencia"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  // Reset form data
                  setFormData({
                    name: customer.name,
                    email: customer.email || '',
                    status: customer.status,
                    city: customer.city || '',
                    gender: customer.gender || '',
                    examType: customer.examType || '',
                    aspirantTo: customer.aspirantTo || '',
                    group: customer.group || '',
                    emergencyContact: customer.emergencyContact || '',
                    emergencyPhone: customer.emergencyPhone || ''
                  })
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={updating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                disabled={updating}
              >
                {updating ? 'Guardando...' : (
                  <>
                    <FiSave className="mr-1" /> Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Status Badge */}
            <div className="mb-4 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(customer.status)}`}>
                {getStatusLabel(customer.status)}
              </span>
            </div>
            
            {/* User Information */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center">
                <FiPhone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
                <p className="dark:text-gray-200">{customer.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiMail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="dark:text-gray-200">
                  {customer.email || 'No disponible'}
                </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Género</p>
                  <p className="dark:text-gray-200">
                    {customer.gender ? getGenderLabel(customer.gender) : 'No especificado'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiMapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ciudad</p>
                  <p className="dark:text-gray-200">
                    {customer.city || 'No especificada'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiBookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tipo de Examen</p>
                  <p className="dark:text-gray-200">
                    {customer.examType || 'No especificado'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiTarget className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Aspirante a</p>
                  <p className="dark:text-gray-200">
                    {customer.aspirantTo || 'No especificado'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiMessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Grupo</p>
                  <p className="dark:text-gray-200">
                    {customer.group || 'No especificado'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiInfo className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Contacto de Emergencia</p>
                  <p className="dark:text-gray-200">
                    {customer.emergencyContact || 'No especificado'}
                  </p>
                  {customer.emergencyPhone && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tel: {customer.emergencyPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Edit Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
              >
                <FiEdit2 className="mr-2" /> Editar perfil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Helper functions
function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'activo':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'inactivo':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'suspendido':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'egresado':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'activo': return 'Activo'
    case 'inactivo': return 'Inactivo'
    case 'pendiente': return 'Pendiente'
    case 'suspendido': return 'Suspendido'
    case 'egresado': return 'Egresado'
    default: return status
  }
}

function getGenderLabel(gender: string): string {
  switch (gender) {
    case 'masculino': return 'Masculino'
    case 'femenino': return 'Femenino'
    case 'otro': return 'Otro'
    case 'prefiero_no_decir': return 'Prefiero no decir'
    default: return gender
  }
} 