
/**
 * Root layout component for the Todo application.
 * Provides shared layout structure and global styles.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/app/components/Header/page'
import { AuthProvider } from '@/app/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App - AI-Powered Task Management',
  description: 'A full-stack todo application with AI chatbot integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-white border-t py-4">
              <div className="container mx-auto px-4 text-center text-gray-600">
                <p>© 2024 Todo App. Built with Next.js, FastAPI, and OpenAI.</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}