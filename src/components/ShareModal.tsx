'use client'

import { PublishedCard } from '@/lib/types'
import { useState } from 'react'
import { Share2, Copy, Check, Link2, MessageCircle } from 'lucide-react'

interface ShareModalProps {
  open: boolean
  onClose: () => void
  card: PublishedCard
}

export default function ShareModal({ open, onClose, card }: ShareModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  if (!open) return null

  const cardUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/card/${card.id}`
    : ''

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text; document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); document.body.removeChild(ta)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const shareText = `📌 ${card.cardData.title}\n📍 ${card.cardData.location}\n⏰ ${card.cardData.duration} · 💰 ${card.cardData.budget}\n\n${card.userCaption}\n\n🔗 ${cardUrl}`

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-primary-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">分享攻略</h3>
          <p className="text-sm text-gray-500">让更多人看到你的旅行分享</p>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <button
            onClick={() => copyText(cardUrl, 'link')}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-gray-800">复制链接</p>
              <p className="text-xs text-gray-400 truncate">{cardUrl}</p>
            </div>
            {copied === 'link' ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-gray-300" />
            )}
          </button>

          <button
            onClick={() => copyText(shareText, 'wechat')}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
              💬
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-gray-800">复制分享文本</p>
              <p className="text-xs text-gray-400">可粘贴到微信、QQ等</p>
            </div>
            {copied === 'wechat' ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-gray-300" />
            )}
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: card.cardData.title, text: shareText, url: cardUrl })
              } else {
                copyText(shareText, 'native')
              }
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-gray-800">系统分享</p>
              <p className="text-xs text-gray-400">调起系统分享面板</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
