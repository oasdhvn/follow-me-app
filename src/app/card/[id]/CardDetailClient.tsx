'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Clock, Wallet, Calendar, Hash, Lightbulb,
  Heart, Bookmark, Share2, MessageCircle, ArrowLeft,
  Trash2, Send,
} from 'lucide-react'
import { PublishedCard } from '@/lib/types'
import { getCardById, toggleLike, toggleBookmark, addComment, deleteCard } from '@/lib/storage'
import { useAuth } from '@/context/AuthContext'
import ShareModal from '@/components/ShareModal'
import AuthModal from '@/components/AuthModal'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return `${Math.floor(days / 30)}个月前`
}

export default function CardDetailClient({ prebuiltIds = [] }: { prebuiltIds?: string[] }) {
  const params = useParams()
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const id = params.id as string

  const [card, setCard] = useState<PublishedCard | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const loadCard = useCallback(() => {
    const c = getCardById(id)
    if (!c) { setNotFound(true); return }
    setCard(c)
  }, [id])

  useEffect(() => { loadCard() }, [loadCard])

  if (notFound) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">找不到这张攻略</h2>
          <p className="text-gray-500 mb-6">攻略可能已被删除或链接有误</p>
          <Link href="/discover" className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full hover:shadow-lg transition-all">
            去发现更多攻略
          </Link>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="w-12 h-12 border-2 border-primary-300 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  const isLiked = user ? card.likedBy.includes(user.id) : false
  const isBookmarked = user ? card.bookmarkedBy.includes(user.id) : false
  const isOwner = user?.id === card.userId

  const handleLike = () => {
    if (!user) { setShowAuth(true); return }
    toggleLike(card.id, user.id)
    refreshUser()
    loadCard()
  }

  const handleBookmark = () => {
    if (!user) { setShowAuth(true); return }
    toggleBookmark(card.id, user.id)
    refreshUser()
    loadCard()
  }

  const handleComment = async () => {
    if (!user) { setShowAuth(true); return }
    if (!commentText.trim()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 200))
    addComment(card.id, user.id, user.username, user.avatar, commentText.trim())
    setCommentText('')
    setSubmitting(false)
    loadCard()
  }

  const handleDelete = () => {
    if (!user || !isOwner) return
    deleteCard(card.id, user.id)
    router.push('/discover')
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">返回</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Gradient Header */}
          <div
            className="relative p-8 pb-14 flex flex-col justify-end"
            style={{
              background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`,
              minHeight: '220px',
            }}
          >
            <div className="absolute inset-0 bg-black/15" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                <span>{card.cardData.location}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {card.cardData.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {card.cardData.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-xs bg-white/20 text-white rounded-full backdrop-blur-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <Clock className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500 mb-1">游玩时长</p>
                <p className="text-sm font-semibold text-gray-800">{card.cardData.duration}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <Wallet className="w-5 h-5 text-accent-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500 mb-1">预算参考</p>
                <p className="text-sm font-semibold text-gray-800">{card.cardData.budget}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <Calendar className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500 mb-1">最佳时间</p>
                <p className="text-sm font-semibold text-gray-800">{card.cardData.bestTime}</p>
              </div>
            </div>

            {/* Highlights */}
            <section className="mb-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                <Hash className="w-5 h-5 text-primary-500" />
                必打卡景点
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {card.cardData.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-transparent rounded-xl border border-primary-100">
                    <span className="w-7 h-7 flex items-center justify-center bg-primary-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips */}
            <section className="mb-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                实用贴士
              </h2>
              <div className="space-y-3">
                {card.cardData.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <span className="text-yellow-500 flex-shrink-0">💡</span>
                    <span className="text-sm text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Author & Caption */}
            <section className="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{card.avatar}</span>
                <div>
                  <p className="font-medium text-gray-800">{card.username}</p>
                  <p className="text-xs text-gray-400">{timeAgo(card.createdAt)}</p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                    title="删除攻略"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{card.userCaption}</p>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-between py-4 border-t border-gray-100 mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm ${
                    isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{card.likes > 0 ? card.likes : ''} {isLiked ? '已喜欢' : '喜欢'}</span>
                </button>
                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm ${
                    isBookmarked ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-500'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? '已收藏' : '收藏'}</span>
                </button>
              </div>
              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all text-sm"
              >
                <Share2 className="w-4 h-4" />
                分享
              </button>
            </div>

            {/* Comments */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-5">
                <MessageCircle className="w-5 h-5 text-primary-500" />
                评论
                <span className="text-sm font-normal text-gray-400">({card.comments.length})</span>
              </h2>

              {/* Comment Input */}
              <div className="flex items-start gap-3 mb-6">
                {user ? (
                  <>
                    <span className="text-2xl mt-1">{user.avatar}</span>
                    <div className="flex-1 flex items-end gap-2">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="写下你的旅行想法..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 resize-none"
                        rows={2}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleComment()
                          }
                        }}
                      />
                      <button
                        onClick={handleComment}
                        disabled={!commentText.trim() || submitting}
                        className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl disabled:opacity-40 hover:shadow-md transition-all flex-shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="w-full py-3 text-sm text-primary-500 border border-primary-200 rounded-2xl hover:bg-primary-50 transition-all"
                  >
                    登录后参与评论 →
                  </button>
                )}
              </div>

              {/* Comment List */}
              {card.comments.length > 0 ? (
                <div className="space-y-4">
                  {card.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{c.avatar}</span>
                      <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-medium text-gray-800">{c.username}</span>
                          <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">还没有评论，来第一个分享想法吧</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">确认删除攻略？</h3>
            <p className="text-sm text-gray-500 mb-6">删除后无法恢复，评论和点赞数据也会一并删除。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      <ShareModal open={showShare} onClose={() => setShowShare(false)} card={card} />
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  )
}
