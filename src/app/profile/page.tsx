'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Heart, Bookmark, FileText, Edit3, Check, X,
  LogOut, Plus, ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getUserCards, getBookmarkedCards, getUsers, saveUsers } from '@/lib/storage'
import { PublishedCard } from '@/lib/types'
import CardItem from '@/components/CardItem'
import AuthModal from '@/components/AuthModal'

type Tab = 'my' | 'bookmarks'

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth()
  const router = useRouter()

  const [tab, setTab] = useState<Tab>('my')
  const [myCards, setMyCards] = useState<PublishedCard[]>([])
  const [bookmarkedCards, setBookmarkedCards] = useState<PublishedCard[]>([])
  const [showAuth, setShowAuth] = useState(false)

  // 编辑资料
  const [editingBio, setEditingBio] = useState(false)
  const [bioText, setBioText] = useState('')

  const loadData = useCallback(() => {
    if (!user) return
    setMyCards(getUserCards(user.id))
    setBookmarkedCards(getBookmarkedCards(user.id))
    setBioText(user.bio || '')
  }, [user])

  useEffect(() => { loadData() }, [loadData])

  const handleSaveBio = () => {
    if (!user) return
    const users = getUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx >= 0) {
      users[idx].bio = bioText
      saveUsers(users)
      refreshUser()
    }
    setEditingBio(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // 未登录
  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🧭</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">登录查看个人主页</h2>
          <p className="text-gray-500 mb-6">记录你的旅行故事，分享给更多人</p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
          >
            立即登录
          </button>
          <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </div>
      </div>
    )
  }

  const displayCards = tab === 'my' ? myCards : bookmarkedCards
  const totalLikes = myCards.reduce((sum, c) => sum + c.likes, 0)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 mb-6">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-br from-primary-400 via-accent-400 to-primary-500 relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border-2 border-white flex items-center justify-center text-3xl">
                {user.avatar}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors py-2 px-3 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                退出
              </button>
            </div>

            {/* Name */}
            <h1 className="text-xl font-bold text-gray-900 mb-1">{user.username}</h1>

            {/* Bio */}
            {editingBio ? (
              <div className="flex items-start gap-2 mt-2">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="flex-1 text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none resize-none text-gray-700"
                  rows={2}
                  maxLength={100}
                  placeholder="写一段个人简介..."
                />
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={handleSaveBio} className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingBio(false)} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500 flex-1">{user.bio || '这个用户很懒，什么都没写~'}</p>
                <button onClick={() => setEditingBio(true)} className="text-gray-400 hover:text-primary-500 transition-colors flex-shrink-0">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FileText className="w-4 h-4 text-primary-500" />
                </div>
                <p className="text-xl font-bold text-gray-900">{myCards.length}</p>
                <p className="text-xs text-gray-500">发布攻略</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-xl font-bold text-gray-900">{totalLikes}</p>
                <p className="text-xs text-gray-500">获得喜欢</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Bookmark className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-xl font-bold text-gray-900">{bookmarkedCards.length}</p>
                <p className="text-xs text-gray-500">我的收藏</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab('my')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === 'my' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MapPin className="w-4 h-4" />
            我的攻略 {myCards.length > 0 && `(${myCards.length})`}
          </button>
          <button
            onClick={() => setTab('bookmarks')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === 'bookmarks' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            我的收藏 {bookmarkedCards.length > 0 && `(${bookmarkedCards.length})`}
          </button>
        </div>

        {/* Cards Grid */}
        {displayCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCards.map((card) => (
              <CardItem key={card.id} card={card} onUpdate={loadData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">
              {tab === 'my' ? '✈️' : '🔖'}
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {tab === 'my' ? '还没有发布过攻略' : '还没有收藏任何攻略'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {tab === 'my' ? '用AI生成你的第一张旅行攻略卡片吧！' : '在发现页浏览并收藏你喜欢的攻略'}
            </p>
            <Link
              href={tab === 'my' ? '/' : '/discover'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
            >
              {tab === 'my' ? (
                <>
                  <Plus className="w-4 h-4" />
                  去生成攻略
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  去发现攻略
                </>
              )}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
