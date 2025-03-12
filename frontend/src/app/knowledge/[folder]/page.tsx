'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getFiles, createFile } from '@/lib/api/knowledge'
import Dashboard from '@/components/Dashboard'
import Link from 'next/link'
import { FiFile, FiFilePlus, FiX } from 'react-icons/fi'

export default function FolderPage({ params }: { params: { folder: string } }) {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const router = useRouter()
  const { folder } = params

  useEffect(() => {
    loadFiles()
  }, [folder])

  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await getFiles(folder)
      setFiles(response.files)
      setError(null)
    } catch (err) {
      setError('Error al cargar los archivos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileClick = (file: string) => {
    router.push(`/knowledge/${folder}/${file}`)
  }

  const handleCreateFile = async () => {
    if (!newFileName.trim()) {
      setCreateError('El nombre del archivo no puede estar vacío')
      return
    }

    // Asegurarse de que el archivo tenga extensión .md
    let fileName = newFileName.trim()
    if (!fileName.endsWith('.md')) {
      fileName += '.md'
    }

    try {
      setIsCreating(true)
      setCreateError(null)
      await createFile(folder, fileName)
      setNewFileName('')
      setIsModalOpen(false)
      // Recargar la lista de archivos
      await loadFiles()
    } catch (err) {
      setCreateError('Error al crear el archivo')
      console.error(err)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dashboard>
      <div className="h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/knowledge" className="text-primary-500 hover:text-primary-700 mr-2">
              &larr; Volver
            </Link>
            <h1 className="text-2xl font-bold">Carpeta: {folder}</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            <FiFilePlus className="mr-2" />
            Nuevo Archivo
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
        ) : files.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No hay archivos en esta carpeta
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg mr-3">
                    <FiFile className="w-6 h-6 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-semibold">{file}</h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para crear archivo */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Nuevo Archivo</h2>
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
                <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del archivo
                </label>
                <input
                  type="text"
                  id="fileName"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ingrese el nombre del archivo (ej: documento.md)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Si no incluye la extensión .md, se agregará automáticamente.
                </p>
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
                  onClick={handleCreateFile}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <FiFilePlus className="mr-2" />
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