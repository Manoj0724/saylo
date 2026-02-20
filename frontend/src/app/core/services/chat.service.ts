import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { environment } from '../../../environments/environment'

export interface Message {
  _id: string
  chat: string
  sender: { _id: string; name: string; avatar: string | null }
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system'
  content: string
  replyTo?: Message | null
  reactions: { user: string; emoji: string }[]
  readBy: { user: string; readAt: string }[]
  isDeleted: boolean
  createdAt: string
}

export interface ChatMember {
  user: { _id: string; name: string; avatar: string | null; status: string; lastSeen: string }
  role: string
  lastRead: string | null
}

export interface Chat {
  _id: string
  type: 'private' | 'group'
  name: string | null
  avatar: string | null
  members: ChatMember[]
  lastMessage: Message | null
  updatedAt: string
  unreadCount?: number
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = environment.apiUrl

  activeChat   = signal<Chat | null>(null)
  chats        = signal<Chat[]>([])
  messages     = signal<Message[]>([])
  typingUsers  = signal<Record<string, string[]>>({})  // chatId → userIds

  constructor(private http: HttpClient) {}

  // ── CHATS ────────────────────────────────────────────────
  getMyChats(): Observable<{ success: boolean; data: { chats: Chat[] } }> {
    return this.http.get<any>(`${this.api}/chats`).pipe(
      tap(res => this.chats.set(res.data.chats))
    )
  }

  createOrGetChat(userId: string): Observable<{ success: boolean; data: { chat: Chat } }> {
    return this.http.post<any>(`${this.api}/chats`, { userId }).pipe(
      tap(res => {
        const chat = res.data.chat
        const exists = this.chats().find(c => c._id === chat._id)
        if (!exists) this.chats.update(list => [chat, ...list])
        this.activeChat.set(chat)
      })
    )
  }

  createGroupChat(name: string, memberIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.api}/chats/group`, { name, memberIds }).pipe(
      tap(res => {
        this.chats.update(list => [res.data.chat, ...list])
        this.activeChat.set(res.data.chat)
      })
    )
  }

  // ── MESSAGES ─────────────────────────────────────────────
  getMessages(chatId: string, page = 1): Observable<any> {
    return this.http.get<any>(`${this.api}/messages/${chatId}?page=${page}&limit=50`).pipe(
      tap(res => {
        if (page === 1) this.messages.set(res.data.messages)
        else this.messages.update(msgs => [...res.data.messages, ...msgs])
      })
    )
  }

  // ── USERS ────────────────────────────────────────────────
  searchUsers(q: string): Observable<any> {
    return this.http.get<any>(`${this.api}/users?q=${q}`)
  }

  // ── LOCAL STATE HELPERS ──────────────────────────────────
  addMessage(message: Message): void {
    this.messages.update(msgs => [...msgs, message])
    this.chats.update(list =>
      list.map(c => c._id === message.chat
        ? { ...c, lastMessage: message, updatedAt: message.createdAt }
        : c
      ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    )
  }

  setTyping(chatId: string, userId: string, isTyping: boolean): void {
    this.typingUsers.update(state => {
      const current = state[chatId] || []
      return {
        ...state,
        [chatId]: isTyping
          ? [...new Set([...current, userId])]
          : current.filter(id => id !== userId)
      }
    })
  }

getChatDisplayName(chat: Chat, myId: string): string {
  if (!chat) return 'Unknown'
  if (chat.type === 'group') return chat.name || 'Group'
  const other = chat.members?.find(m => m.user?._id !== myId)
  return other?.user?.name || 'Unknown'
}

getChatOtherUser(chat: Chat, myId: string): ChatMember['user'] | null {
  if (!chat || !chat.members) return null
  return chat.members.find(m => m.user?._id !== myId)?.user || null
}

 getAvatarColor(name: string): string {
  const colors = [
    'linear-gradient(135deg,#6C63FF,#00D4FF)',
    'linear-gradient(135deg,#FF6B9D,#FFB800)',
    'linear-gradient(135deg,#00E5A0,#00D4FF)',
    'linear-gradient(135deg,#FFB800,#FF6B9D)',
    'linear-gradient(135deg,#8B5CF6,#EC4899)',
    'linear-gradient(135deg,#10B981,#3B82F6)',
  ]
  if (!name || typeof name !== 'string') return colors[0]
  let hash = 0
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
}