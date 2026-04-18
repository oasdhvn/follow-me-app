'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AuthMode } from '@/lib/types'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  defaultMode?: AuthMode
}

export default function AuthModal({ open, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 小延迟模拟
    await new Promise(r => setTimeout(r, 300))

    if (mode === 'login') {
      const err = login(username, password)
      if (err) { setError(err); setLoading(false); return }
    } else {
      if (password !== confirmPwd) { setError('两次密码不一致'); setLoading(false); return }
      const err = register(username, password)
      if (err) { setError(err); setLoading(false); return }
    }

    setLoading(false)
    setUsername(''); setPassword(''); setConfirmPwd('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl">
            🧭
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{mode === 'login' ? '欢迎回来' : '加入我们'}</h2>
          <p className="text-gray-500 text-sm mt-1">{mode === 'login' ? '登录你的账号，继续探索世界' : '创建账号，开始你的旅行分享'}</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-white shadow text-primary-600' : 'text-gray-500'}`}
          >
            登录
          </button>
          <button
            onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'register' ? 'bg-white shadow text-primary-600' : 'text-gray-500'}`}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              minLength={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none text-gray-800"
              placeholder="输入用户名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none text-gray-800"
              placeholder="输入密码"
            />
          </div>
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none text-gray-800"
                placeholder="再次输入密码"
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? '处理中...' : mode === 'login' ? '登 录' : '注 册'}
          </button>
        </form>

        {mode === 'login' && (
          <div className="mt-4 text-center text-xs text-gray-400">
            演示账号：旅行家小王 / demo
          </div>
        )}
      </div>
    </div>
  )
}
