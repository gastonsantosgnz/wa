import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

// Cargar fuente Inter
const inter = Inter({ subsets: ['latin'] })

// Metadatos de la aplicación
export const metadata: Metadata = {
  title: 'WhatsApp CRM + IA',
  description: 'Sistema CRM conectado a WhatsApp Business con IA',
}

// Layout principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 