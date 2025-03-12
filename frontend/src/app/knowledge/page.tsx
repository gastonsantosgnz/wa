'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getFolders, createFolder } from '@/lib/api/knowledge'
import Dashboard from '@/components/Dashboard'
import { FiFolder, FiFolderPlus, FiX } from 'react-icons/fi'

export default function KnowledgePage() {
  const [folders, setFolders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadFolders()
  }, [])

  const loadFolders = async () => {
    try {
      setLoading(true)
      const response = await getFolders()
      setFolders(response.folders)
      setError(null)
    } catch (err) {
      setError('Error al cargar las carpetas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFolderClick = (folder: string) => {
    router.push(`/knowledge/${folder}`)
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setCreateError('El nombre de la carpeta no puede estar vacío')
      return
    }

    try {
      setIsCreating(true)
      setCreateError(null)
      await createFolder(newFolderName.trim())
      setNewFolderName('')
      setIsModalOpen(false)
      // Recargar la lista de carpetas
      await loadFolders()
    } catch (err) {
      setCreateError('Error al crear la carpeta')
      console.error(err)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dashboard>
      <div className="h-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Base de Conocimiento</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            <FiFolderPlus className="mr-2" />
            Nueva Carpeta
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <div
                key={folder}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleFolderClick(folder)}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg mr-3">
                    <FiFolder className="w-6 h-6 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-semibold">{folder}</h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para crear carpeta */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Nueva Carpeta</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              {createError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {createError}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la carpeta
                </label>
                <input
                  type="text"
                  id="folderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ingrese el nombre de la carpeta"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
                  disabled={isCreating}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <FiFolderPlus className="mr-2" />
                  )}
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  )
} 