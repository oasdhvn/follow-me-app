import { User, PublishedCard } from './types'

const USERS_KEY = 'followme_users'
const CARDS_KEY = 'followme_cards'
const CURRENT_USER_KEY = 'followme_current_user'

// ==================== Users ====================

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch { return [] }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByUsername(username: string): User | undefined {
  return getUsers().find(u => u.username === username)
}

export function createUser(username: string, password: string): User | null {
  if (findUserByUsername(username)) return null
  const avatars = ['🧑‍💻', '👩‍🎨', '🧑‍🔬', '👨‍🍳', '👩‍✈️', '🧑‍🚀', '👩‍🌾', '🧑‍🎤']
  const user: User = {
    id: crypto.randomUUID(),
    username,
    password,
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    bio: '这个用户很懒，什么都没写~',
    createdAt: new Date().toISOString(),
  }
  const users = getUsers()
  users.push(user)
  saveUsers(users)
  return user
}

export function verifyUser(username: string, password: string): User | null {
  const user = findUserByUsername(username)
  if (!user || user.password !== password) return null
  return user
}

// ==================== Current User Session ====================

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY)
    if (!data) return null
    const { id } = JSON.parse(data)
    return getUsers().find(u => u.id === id) || null
  } catch { return null }
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: user.id }))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

// ==================== Published Cards ====================

export function getCards(): PublishedCard[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CARDS_KEY) || '[]')
  } catch { return [] }
}

export function saveCards(cards: PublishedCard[]) {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
}

export function getCardById(id: string): PublishedCard | undefined {
  return getCards().find(c => c.id === id)
}

export function getUserCards(userId: string): PublishedCard[] {
  return getCards().filter(c => c.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function publishCard(card: Omit<PublishedCard, 'id' | 'likes' | 'likedBy' | 'bookmarks' | 'bookmarkedBy' | 'comments' | 'createdAt'>): PublishedCard {
  const newCard: PublishedCard = {
    ...card,
    id: crypto.randomUUID(),
    likes: 0,
    likedBy: [],
    bookmarks: 0,
    bookmarkedBy: [],
    comments: [],
    createdAt: new Date().toISOString(),
  }
  const cards = getCards()
  cards.unshift(newCard)
  saveCards(cards)
  return newCard
}

export function toggleLike(cardId: string, userId: string): PublishedCard | null {
  const cards = getCards()
  const card = cards.find(c => c.id === cardId)
  if (!card) return null
  const idx = card.likedBy.indexOf(userId)
  if (idx >= 0) {
    card.likedBy.splice(idx, 1)
    card.likes = Math.max(0, card.likes - 1)
  } else {
    card.likedBy.push(userId)
    card.likes += 1
  }
  saveCards(cards)
  return card
}

export function toggleBookmark(cardId: string, userId: string): PublishedCard | null {
  const cards = getCards()
  const card = cards.find(c => c.id === cardId)
  if (!card) return null
  const idx = card.bookmarkedBy.indexOf(userId)
  if (idx >= 0) {
    card.bookmarkedBy.splice(idx, 1)
    card.bookmarks = Math.max(0, card.bookmarks - 1)
  } else {
    card.bookmarkedBy.push(userId)
    card.bookmarks += 1
  }
  saveCards(cards)
  return card
}

export function addComment(cardId: string, userId: string, username: string, avatar: string, content: string): PublishedCard | null {
  const cards = getCards()
  const card = cards.find(c => c.id === cardId)
  if (!card) return null
  card.comments.push({
    id: crypto.randomUUID(),
    userId,
    username,
    avatar,
    content,
    createdAt: new Date().toISOString(),
  })
  saveCards(cards)
  return card
}

export function deleteCard(cardId: string, userId: string): boolean {
  const cards = getCards()
  const idx = cards.findIndex(c => c.id === cardId && c.userId === userId)
  if (idx < 0) return false
  cards.splice(idx, 1)
  saveCards(cards)
  return true
}

export function getBookmarkedCards(userId: string): PublishedCard[] {
  return getCards().filter(c => c.bookmarkedBy.includes(userId)).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getRecentCards(limit = 20): PublishedCard[] {
  return getCards().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, limit)
}

export function searchCards(query: string): PublishedCard[] {
  const q = query.toLowerCase()
  return getCards().filter(c =>
    c.cardData.title.toLowerCase().includes(q) ||
    c.cardData.location.toLowerCase().includes(q) ||
    c.cardData.tags.some(t => t.toLowerCase().includes(q)) ||
    c.userCaption.toLowerCase().includes(q)
  )
}
