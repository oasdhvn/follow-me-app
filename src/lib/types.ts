// 类型定义

export interface User {
  id: string
  username: string
  password: string
  avatar: string
  bio: string
  createdAt: string
}

export interface GuideCard {
  title: string
  location: string
  duration: string
  budget: string
  highlights: string[]
  tips: string[]
  bestTime: string
  tags: string[]
}

export interface PublishedCard {
  id: string
  userId: string
  username: string
  avatar: string
  cardData: GuideCard
  userCaption: string
  likes: number
  likedBy: string[]
  bookmarks: number
  bookmarkedBy: string[]
  comments: Comment[]
  createdAt: string
  gradientFrom: string
  gradientTo: string
}

export interface Comment {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  createdAt: string
}

export type AuthMode = 'login' | 'register'
