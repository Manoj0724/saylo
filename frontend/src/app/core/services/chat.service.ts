import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { environment } from '../../../environments/environment'

export interface User {
  _id:      string
  name:     string
  email:    string
  avatar:   string | null
  status:   string
  bio?:     string
  phone?:   string
  lastSeen?: string
}

export interface Member {
  user:     User
  role:     'admin' | 'member'
  joinedAt: string
}

export interface Message {
  _id:       string
  chat:      string
  sender:    User
  content:   string
  type:      string
  replyTo?:  any
  reactions: { user: string; emoji: string }[]
  readBy:    { user: string; readAt: string }[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Chat {
  _id:             string
  type:            'direct' | 'group'
  name?:           string
  members:         Member[]
  participants?:   Member[]
  lastMessage?:    Message
  lastMessageText?: string
  lastActivity:    string
  unreadCount:     number
  isActive:        boolean
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private chatApi    = `${environment.apiUrl}/chats`
  private messageApi = `${environment.apiUrl}/messages`
  private userApi    = `${environment.apiUrl}/users`

  chats       = signal<Chat[]>([])
  activeChat  = signal<Chat | null>(null)
  messages    = signal<Message[]>([])
  typingUsers = signal<Record<string, string[]>>({})

  constructor(private http: HttpClient) {}

  // ── CHATS ─────────────────────────────────────────────────
  getMyChats(): Observable<any> {
    return this.http.get<any>(this.chatApi).pipe(
      tap(res => {
        if (res.success) {
          const chats = (res.data.chats || res.data || []).map((c: any) => this.normalizeChat(c))
          this.chats.set(chats)
        }
      })
    )
  }

  // Alias for getMyChats (used in some components)
  getChats(): Observable<any> {
    return this.getMyChats()
  }

  createOrGetChat(targetUserId: string): Observable<any> {
    return this.http.post<any>(`${this.chatApi}/direct`, { targetUserId }).pipe(
      tap(res => {
        if (res.success) {
          const chat = this.normalizeChat(res.data.chat || res.data)
          this.chats.update(list => {
            const exists = list.find(c => c._id === chat._id)
            if (!exists) return [chat, ...list]
            return list.map(c => c._id === chat._id ? chat : c)
          })
        }
      })
    )
  }

  // Alias for createOrGetChat
  createOrGetDirectChat(targetUserId: string): Observable<any> {
    return this.createOrGetChat(targetUserId)
  }

  // ── MESSAGES ──────────────────────────────────────────────
  getMessages(chatId: string, page = 1): Observable<any> {
    return this.http.get<any>(`${this.messageApi}/${chatId}?page=${page}&limit=50`).pipe(
      tap(res => {
        if (res.success) {
          const msgs = res.data.messages || res.data || []
          this.messages.set(msgs)
        }
      })
    )
  }

  sendMessage(chatId: string, content: string): Observable<any> {
    return this.http.post<any>(`${this.messageApi}/${chatId}`, { content })
  }

  markAsRead(chatId: string): Observable<any> {
    return this.http.post<any>(`${this.messageApi}/${chatId}/read`, {})
  }

  addMessage(message: Message): void {
    this.messages.update(msgs => [...msgs, message])
    this.chats.update(list =>
      list.map(c => c._id === message.chat
        ? { ...c, lastMessage: message, lastMessageText: message.content, lastActivity: message.createdAt }
        : c
      )
    )
  }

  // ── USERS ─────────────────────────────────────────────────
  getUsers(): Observable<any> {
    return this.http.get<any>(this.userApi)
  }

  searchUsers(query: string): Observable<any> {
    return this.http.get<any>(`${this.userApi}/search?q=${encodeURIComponent(query)}`)
  }

  // ── TYPING ────────────────────────────────────────────────
  setTyping(chatId: string, userId: string, isTyping: boolean): void {
    this.typingUsers.update(map => {
      const users = map[chatId] || []
      if (isTyping) {
        return { ...map, [chatId]: [...new Set([...users, userId])] }
      } else {
        return { ...map, [chatId]: users.filter(id => id !== userId) }
      }
    })
  }

  // ── HELPERS ───────────────────────────────────────────────
  private normalizeChat(c: any): Chat {
    const members = (c.members || c.participants || []).map((p: any) => ({
      user: p.user || p,
      role: p.role || 'member',
      joinedAt: p.joinedAt || c.createdAt,
    }))
    return {
      ...c,
      members,
      lastMessageText: c.lastMessageText || c.lastMessage?.content || '',
      unreadCount: c.unreadCount || c.unread || 0,
    }
  }

  getChatDisplayName(chat: Chat, myId: string): string {
    if (chat.type === 'group') return chat.name || 'Group'
    const other = this.getChatOtherUser(chat, myId)
    return other?.name || 'Unknown'
  }

  getChatOtherUser(chat: Chat, myId: string): User | null {
    const members = chat.members || []
    const other = members.find(m => {
      const uid = typeof m.user === 'object' ? m.user._id : m.user
      return uid !== myId
    })
    return other?.user as User || null
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#6C63FF','#FF6B9D','#00D4FF','#00E5A0',
      '#FFB800','#FF6B6B','#8B5CF6','#06B6D4',
    ]
    let hash = 0
    for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
}