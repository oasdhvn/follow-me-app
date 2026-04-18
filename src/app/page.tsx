'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  MapPin,
  Clock,
  Wallet,
  Calendar,
  Lightbulb,
  Hash,
  Loader2,
  Compass,
  Heart,
  Share2,
  Edit3,
  Check,
  BookmarkPlus,
  Send,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { publishCard, getRecentCards } from '@/lib/storage'
import { PublishedCard, GuideCard } from '@/lib/types'
import CardItem from '@/components/CardItem'
import ShareModal from '@/components/ShareModal'
import AuthModal from '@/components/AuthModal'

const GRADIENTS = [
  { from: '#0ea5e9', to: '#d946ef' },
  { from: '#f97316', to: '#ef4444' },
  { from: '#10b981', to: '#06b6d4' },
  { from: '#8b5cf6', to: '#ec4899' },
  { from: '#f59e0b', to: '#f97316' },
  { from: '#06b6d4', to: '#8b5cf6' },
]

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  const [keywords, setKeywords] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cardData, setCardData] = useState<GuideCard | null>(null)
  const [userCaption, setUserCaption] = useState('')
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [liked, setLiked] = useState(false)

  // 已发布的卡片对象（用于分享弹窗）
  const [publishedCard, setPublishedCard] = useState<PublishedCard | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  // 首页推荐卡片
  const [recentCards, setRecentCards] = useState<PublishedCard[]>([])

  useEffect(() => {
    setRecentCards(getRecentCards(6))
  }, [])

  const refreshFeed = () => setRecentCards(getRecentCards(6))

  const generateCard = useCallback(async (kw?: string) => {
    const query = kw ?? keywords
    if (!query.trim()) return

    setIsLoading(true)
    setCardData(null)
    setPublishedCard(null)
    setPublishSuccess(false)
    setLiked(false)

    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: query }),
      })
      const result = await response.json()
      if (result.success) {
        setCardData(result.data)
        setUserCaption(`分享我的${result.data.location}之旅，这些地方真的太美了！✨`)
      }
    } catch (error) {
      console.error('Failed to generate card:', error)
    } finally {
      setIsLoading(false)
    }
  }, [keywords])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generateCard()
    }
  }

  const handlePublish = () => {
    if (!user) { setShowAuthModal(true); return }
    if (!cardData) return

    const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
    const card = publishCard({
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      cardData,
      userCaption,
      gradientFrom: gradient.from,
      gradientTo: gradient.to,
    })
    setPublishedCard(card)
    setPublishSuccess(true)
    refreshFeed()
    // 2秒后跳转发现页
    setTimeout(() => router.push('/discover'), 2000)
  }

  const handleShare = () => {
    if (!publishedCard) {
      // 先发布再分享
      if (!user) { setShowAuthModal(true); return }
      if (!cardData) return
      const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
      const card = publishCard({
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        cardData,
        userCaption,
        gradientFrom: gradient.from,
        gradientTo: gradient.to,
      })
      setPublishedCard(card)
      setPublishSuccess(true)
      refreshFeed()
      setShowShare(true)
    } else {
      setShowShare(true)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="pt-20 pb-12">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            用<span className="gradient-text">AI</span>记录你的旅行
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            输入关键词，一键生成精美攻略卡片，分享给更多旅行者
          </p>

          {/* Input Area */}
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center gap-2 p-2 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Sparkles className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入目的地或关键词，如：日本京都、云南大理..."
                  className="flex-1 py-3 text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
              <button
                onClick={() => generateCard()}
                disabled={isLoading || !keywords.trim()}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    生成中
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    生成卡片
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['日本京都', '云南大理', '西藏拉萨', '成都美食', '厦门鼓浪屿', '重庆夜景'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setKeywords(tag)
                  generateCard(tag)
                }}
                className="px-4 py-1.5 text-sm text-gray-600 bg-white rounded-full border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
              <p className="text-gray-500">AI 正在为你生成专属旅行攻略...</p>
            </div>
          </section>
        )}

        {/* Card Preview */}
        {cardData && !isLoading && (
          <section className="max-w-4xl mx-auto px-4 animate-fade-in-up">
            {/* 发布成功提示 */}
            {publishSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-green-700 font-medium">攻略已成功发布！</p>
                  <p className="text-green-600 text-sm">正在跳转到发现页...</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Card Header */}
              <div className="relative h-52 bg-gradient-to-br from-primary-400 via-accent-400 to-primary-500 p-6 flex flex-col justify-end">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{cardData.location}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {cardData.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {cardData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs bg-white/20 text-white rounded-full backdrop-blur-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Quick Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Clock className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">游玩时长</p>
                    <p className="text-sm font-medium text-gray-800">{cardData.duration}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Wallet className="w-5 h-5 text-accent-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">预算参考</p>
                    <p className="text-sm font-medium text-gray-800">{cardData.budget}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">最佳时间</p>
                    <p className="text-sm font-medium text-gray-800">{cardData.bestTime}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                    <Hash className="w-5 h-5 text-primary-500" />
                    必打卡景点
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cardData.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary-50 to-transparent rounded-lg"
                      >
                        <span className="w-6 h-6 flex items-center justify-center bg-primary-500 text-white text-xs rounded-full flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    实用贴士
                  </h3>
                  <div className="space-y-2">
                    {cardData.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg"
                      >
                        <span className="text-yellow-500 mt-0.5 flex-shrink-0">💡</span>
                        <span className="text-sm text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Caption */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <Edit3 className="w-5 h-5 text-primary-500" />
                      我的文案
                    </h3>
                    <button
                      onClick={() => setIsEditingCaption(!isEditingCaption)}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      {isEditingCaption ? '完成' : '编辑'}
                    </button>
                  </div>
                  {isEditingCaption ? (
                    <textarea
                      value={userCaption}
                      onChange={(e) => setUserCaption(e.target.value)}
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none resize-none text-gray-700"
                      rows={3}
                      placeholder="写下你的旅行感受..."
                    />
                  ) : (
                    <p className="text-gray-600 bg-gray-50 rounded-xl p-4">{userCaption}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
                        liked
                          ? 'bg-red-50 text-red-500'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{liked ? '已喜欢' : '喜欢'}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">分享</span>
                    </button>
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={publishSuccess}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {publishSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">已发布</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span className="text-sm font-medium">发布攻略</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!cardData && !isLoading && (
          <section className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                <Compass className="w-12 h-12 text-primary-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                开始创建你的旅行攻略
              </h3>
              <p className="text-gray-500">
                输入目的地或关键词，AI将为你生成精美的攻略卡片
              </p>
            </div>

            {/* 最新攻略预览 */}
            {recentCards.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">✨ 最新攻略</h2>
                  <button
                    onClick={() => router.push('/discover')}
                    className="text-sm text-primary-500 hover:text-primary-600"
                  >
                    查看全部 →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentCards.map((card) => (
                    <CardItem key={card.id} card={card} onUpdate={refreshFeed} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 Follow Me · 用AI记录每一次旅行 ✈️</p>
        </div>
      </footer>

      {/* Modals */}
      {publishedCard && (
        <ShareModal
          open={showShare}
          onClose={() => setShowShare(false)}
          card={publishedCard}
        />
      )}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
