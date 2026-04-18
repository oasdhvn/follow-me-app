'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Compass, TrendingUp, Clock, Flame } from 'lucide-react'
import { PublishedCard } from '@/lib/types'
import { getRecentCards, searchCards } from '@/lib/storage'
import CardItem from '@/components/CardItem'

type SortMode = 'recent' | 'hot'

const HOT_TAGS = ['日本', '云南', '西藏', '成都', '厦门', '重庆', '海南', '北京', '上海', '新疆']

export default function DiscoverPage() {
  const [cards, setCards] = useState<PublishedCard[]>([])
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('recent')
  const [searching, setSearching] = useState(false)

  const loadCards = useCallback(() => {
    if (query.trim()) {
      setCards(searchCards(query.trim()))
    } else {
      const all = getRecentCards(50)
      if (sortMode === 'hot') {
        setCards([...all].sort((a, b) => b.likes - a.likes))
      } else {
        setCards(all)
      }
    }
  }, [query, sortMode])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  // 搜索防抖
  useEffect(() => {
    if (!query.trim()) return
    setSearching(true)
    const t = setTimeout(() => {
      loadCards()
      setSearching(false)
    }, 400)
    return () => clearTimeout(t)
  }, [query, loadCards])

  const handleTagClick = (tag: string) => {
    setQuery(tag)
  }

  const clearSearch = () => {
    setQuery('')
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="gradient-text">发现</span> 精彩旅行
          </h1>
          <p className="text-gray-500">探索旅行者们分享的真实旅行攻略</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-md border border-gray-100">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索目的地、攻略标题、话题标签..."
              className="flex-1 py-1 text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 px-2 text-sm"
              >
                清除
              </button>
            )}
          </div>
        </div>

        {/* Hot Tags */}
        {!query && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="flex items-center gap-1 text-sm text-gray-500 mr-1">
              <Flame className="w-4 h-4 text-orange-400" />
              热门：
            </span>
            {HOT_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 text-sm bg-white rounded-full border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-all shadow-sm"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Sort Tabs (仅无搜索词时显示) */}
        {!query && (
          <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
            <button
              onClick={() => setSortMode('recent')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortMode === 'recent' ? 'bg-white shadow text-primary-600' : 'text-gray-500'
              }`}
            >
              <Clock className="w-4 h-4" />
              最新
            </button>
            <button
              onClick={() => setSortMode('hot')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortMode === 'hot' ? 'bg-white shadow text-primary-600' : 'text-gray-500'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              最热
            </button>
          </div>
        )}

        {/* Search Result Header */}
        {query && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <Search className="w-4 h-4" />
            {searching ? (
              <span>搜索中...</span>
            ) : (
              <span>
                搜索 "<span className="text-gray-800 font-medium">{query}</span>" 共找到{' '}
                <span className="text-primary-600 font-medium">{cards.length}</span> 条攻略
              </span>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {cards.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {cards.map((card) => (
              <div key={card.id} className="break-inside-avoid">
                <CardItem card={card} onUpdate={loadCards} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Compass className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {query ? `没有找到关于"${query}"的攻略` : '还没有攻略'}
            </h3>
            <p className="text-gray-400 text-sm">
              {query ? '换个关键词试试吧' : '成为第一个发布攻略的人！'}
            </p>
            {query && (
              <button
                onClick={clearSearch}
                className="mt-4 px-6 py-2 text-sm text-primary-500 border border-primary-200 rounded-full hover:bg-primary-50 transition-all"
              >
                清除搜索
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
