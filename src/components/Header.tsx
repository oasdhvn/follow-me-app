'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Compass, Menu, X } from 'lucide-react'
import AuthModal from './AuthModal'

export default function Header() {
  const { user, logout } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold gradient-text">Follow Me</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/discover" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              发现
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1.5">
                  <span className="text-lg">{user.avatar}</span>
                  <span>{user.username}</span>
                </Link>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                  退出
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-4 py-1.5 text-sm bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full hover:shadow-lg transition-shadow"
              >
                登录
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button onClick={() => setShowMenu(!showMenu)} className="md:hidden text-gray-600">
            {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {showMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            <Link href="/discover" onClick={() => setShowMenu(false)} className="block text-sm text-gray-600 py-2">
              🔍 发现
            </Link>
            {user ? (
              <>
                <Link href="/profile" onClick={() => setShowMenu(false)} className="block text-sm text-gray-600 py-2">
                  👤 {user.username}
                </Link>
                <button onClick={() => { logout(); setShowMenu(false) }} className="block text-sm text-red-500 py-2">
                  退出登录
                </button>
              </>
            ) : (
              <button onClick={() => { setShowAuth(true); setShowMenu(false) }} className="block text-sm text-primary-500 py-2">
                登录 / 注册
              </button>
            )}
          </div>
        )}
      </header>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  )
}
