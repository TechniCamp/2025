'use client'

import { LogOut, Menu, Plus, User, X } from 'lucide-react'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { usePayloadSession } from 'payload-authjs/client'
import { useEffect, useState } from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { session } = usePayloadSession()
  const pathname = usePathname()

  useEffect(() => {
    if (!session) {
      signIn('credentials', {
        callbackUrl: `${window.location.origin}${pathname}`,
      })
    }
  }, [pathname, session])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 py-4 border-b border-slate-800/70">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <Link
            href="/app"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600"
          >
            EduMaterial AI
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-end mr-8">
            <Link
              href="/app/notes/create"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
              text-white font-medium py-2 px-4 rounded-lg shadow-md 
              hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Link>
            <Link
              href="/app"
              className={`transition-colors ${
                pathname === '/app' ? 'text-blue-400 font-medium' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/app/notes"
              className={`transition-colors ${
                pathname === '/app/notes'
                  ? 'text-blue-400 font-medium'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              My Notes
            </Link>
            <Link
              href="/app/notes/public"
              className={`transition-colors ${
                pathname === '/app/notes/public'
                  ? 'text-blue-400 font-medium'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Public Notes
            </Link>
            <Link
              href="/app/flashcards"
              className={`transition-colors ${
                pathname === '/app/flashcards'
                  ? 'text-blue-400 font-medium'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Flashcards
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <User className="w-5 h-5" />
              </button>

              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-2 border border-slate-700 z-50">
                  <button
                    onClick={() => signOut()}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu expanded */}
        {menuOpen && (
          <div className="lg:hidden bg-slate-900 py-4 px-6 mt-4 rounded-lg shadow-lg fixed w-full">
            <div className="flex flex-col space-y-4">
              <Link
                href="/app"
                className={`transition-colors ${
                  pathname === '/app'
                    ? 'text-blue-400 font-medium'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                href="/app/notes"
                className={`transition-colors ${
                  pathname === '/app/notes'
                    ? 'text-blue-400 font-medium'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                My Notes
              </Link>
              <Link
                href="/app/notes/public"
                className={`transition-colors ${
                  pathname === '/app/notes/public'
                    ? 'text-blue-400 font-medium'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Public Notes
              </Link>
              <Link
                href="/app/flashcards"
                className={`transition-colors ${
                  pathname === '/app/flashcards'
                    ? 'text-blue-400 font-medium'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Flashcards
              </Link>
              <Link
                href="/app/notes/create"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                text-white font-medium py-2 px-3 rounded-lg shadow-md 
                hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      {children}

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} EduMaterial AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
