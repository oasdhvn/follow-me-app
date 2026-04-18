'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User } from '@/lib/types'
import { getCurrentUser, setCurrentUser, verifyUser, createUser } from '@/lib/storage'
import { seedDemoData } from '@/lib/seed'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => string | null
  register: (username: string, password: string) => string | null
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(() => {
    const u = getCurrentUser()
    setUser(u)
  }, [])

  useEffect(() => {
    seedDemoData()
    refreshUser()
    setLoading(false)
  }, [refreshUser])

  const login = (username: string, password: string): string | null => {
    const u = verifyUser(username, password)
    if (!u) return '用户名或密码错误'
    setCurrentUser(u)
    setUser(u)
    return null
  }

  const register = (username: string, password: string): string | null => {
    if (username.length < 2) return '用户名至少2个字符'
    if (password.length < 4) return '密码至少4个字符'
    const u = createUser(username, password)
    if (!u) return '用户名已存在'
    setCurrentUser(u)
    setUser(u)
    return null
  }

  const logout = () => {
    setCurrentUser(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
