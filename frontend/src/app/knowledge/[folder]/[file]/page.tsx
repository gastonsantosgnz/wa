'use client'

import { useState, useEffect } from 'react'
import { getFileContent, updateFileContent } from '@/lib/api/knowledge'
import Dashboard from '@/components/Dashboard'
import Link from 'next/link'
import { FiSave, FiEye, FiEdit } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export default function FilePage({ params }: { params: { folder: string; file: string } }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const { folder, file } = params

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        const response = await getFileContent(folder, file)
        setContent(response.content)
        setError(null)
      } catch (err) {
        setError('Error al cargar el contenido del archivo')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [folder, file])

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      await updateFileContent(folder, file, content)
      setSuccess('Archivo guardado correctamente')
      setMode('view')
    } catch (err) {
      setError('Error al guardar el archivo')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dashboard>
      <div className="h-full p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href={`/knowledge/${folder}`} className="text-primary-500 hover:text-primary-700 mr-2">
              &larr; Volver
            </Link>
            <h1 className="text-2xl font-bold">Archivo: {file}</h1>
          </div>
          <div className="flex space-x-2">
            {mode === 'view' ? (
              <button
                onClick={() => setMode('edit')}
                className="flex items-center px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                disabled={loading}
              >
                <FiEdit className="mr-2" /> Editar
              </button>
            ) : (
              <>
                <button
                  onClick={() => setMode('view')}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  disabled={loading || saving}
                >
                  <FiEye className="mr-2" /> Ver
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={loading || saving}
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  Guardar
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : mode === 'view' ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-grow overflow-auto">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                root: ({ node, ...props }) => <div className="prose dark:prose-invert max-w-none" {...props} />
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-grow font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={saving}
          />
        )}
      </div>
    </Dashboard>
  )
} 