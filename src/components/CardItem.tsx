'use client'

import Link from 'next/link'
import { PublishedCard } from '@/lib/types'
import { useAuth } from '@/context/AuthContext'
import { toggleLike, toggleBookmark } from '@/lib/storage'
import { Heart, Bookmark, MessageCircle, MapPin, Clock, Wallet } from 'lucide-react'

interface CardItemProps {
  card: PublishedCard
  onUpdate?: () => void
  compact?: boolean
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}个月前`
  return `${Math.floor(months / 12)}年前`
}

export default function CardItem({ card, onUpdate, compact }: CardItemProps) {
  const { user, refreshUser } = useAuth()
  const isLiked = user ? card.likedBy.includes(user.id) : false
  const isBookmarked = user ? card.bookmarkedBy.includes(user.id) : false

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    toggleLike(card.id, user.id)
    onUpdate?.()
    refreshUser()
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    toggleBookmark(card.id, user.id)
    onUpdate?.()
    refreshUser()
  }

  return (
    <Link href={`/card/${card.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 card-hover">
        {/* Gradient Header */}
        <div
          className="relative p-5 pb-12"
          style={{
            background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`,
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{card.cardData.location}</span>
            </div>
            <h3 className="text-lg font-bold text-white line-clamp-2">
              {card.cardData.title}
            </h3>
          </div>
          {/* Overlapping info bar */}
          <div className="absolute -bottom-5 left-4 right-4 z-20 flex gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-xs text-gray-700 shadow">
              <Clock className="w-3 h-3 text-primary-500" /> {card.cardData.duration}
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-xs text-gray-700 shadow">
              <Wallet className="w-3 h-3 text-accent-500" /> {card.cardData.budget}
            </div>
          </div>
        </div>

        <div className="p-5 pt-8">
          {/* Tags */}
          {!compact && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {card.cardData.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* User caption */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{card.userCaption}</p>

          {/* Author + Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-lg">{card.avatar}</span>
              <span className="text-xs text-gray-500">{card.username}</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">{timeAgo(card.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition-all ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                {card.likes > 0 && card.likes}
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-1 text-xs transition-all ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MessageCircle className="w-3.5 h-3.5" />
                {card.comments.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
