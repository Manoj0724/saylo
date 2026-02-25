import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'

const API = 'http://172.31.58.150:5001/api'

export interface User {
  _id: string; name: string; email: string
  avatar: string | null; status: string; lastSeen?: string
}
export interface Member { user: User; role: 'admin'|'member'; joinedAt: string }
export interface Message {
  _id: string; chat: string; sender: User; content: string; type: string
  replyTo?: Message; reactions: any[]; readBy: any[]; isDeleted: boolean
  createdAt: string; updatedAt: string
}
export interface Chat {
  _id: string; type: 'direct'|'group'; name?: string; members: Member[]
  lastMessage?: Message; lastActivity: string; isActive: boolean; unreadCount: number
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  chats       = signal<Chat[]>([])
  activeChat  = signal<Chat | null>(null)
  messages    = signal<Message[]>([])
  typingUsers = signal<Record<string, string[]>>({})

  constructor(private http: HttpClient) {}

  getChats(): Observable<any> {
    return this.http.get<any>(`${API}/chats`).pipe(
      tap(res => { if (res.success) this.chats.set(res.data.chats || []) })
    )
  }

  createDirectChat(targetUserId: string): Observable<any> {
    return this.http.post<any>(`${API}/chats/direct`, { targetUserId }).pipe(
      tap(res => {
        if (res.success) {
          const chat = res.data.chat
          this.chats.update(list => {
            const exists = list.find(c => c._id === chat._id)
            return exists ? list.map(c => c._id === chat._id ? chat : c) : [chat, ...list]
          })
        }
      })
    )
  }

  // FIXED: was /api/chats/:id/messages -> now /api/messages/:id (matches backend route)
  getMessages(chatId: string, page = 1): Observable<any> {
    return this.http.get<any>(`${API}/messages/${chatId}?page=${page}&limit=50`).pipe(
      tap(res => { if (res.success) this.messages.set(res.data.messages || []) })
    )
  }

  addMessage(message: Message): void {
    this.messages.update(msgs => [...msgs, message])
    this.chats.update(list => list.map(c =>
      c._id === message.chat ? { ...c, lastMessage: message, lastActivity: message.createdAt } : c
    ))
  }

  // FIXED: was ?query= -> now ?q= (matches backend route)
  searchUsers(q: string): Observable<any> {
    return this.http.get<any>(`${API}/users/search?q=${encodeURIComponent(q)}`)
  }

  setTyping(chatId: string, userId: string, typing: boolean): void {
    this.typingUsers.update(map => {
      const users = map[chatId] || []
      return { ...map, [chatId]: typing ? [...new Set([...users, userId])] : users.filter(id => id !== userId) }
    })
  }

  getChatName(chat: Chat, myId: string): string {
    if (chat.type === 'group') return chat.name || 'Group'
    return this.getOtherUser(chat, myId)?.name || 'Unknown'
  }

  getOtherUser(chat: Chat, myId: string): User | null {
    return chat.members.find(m => m.user._id !== myId)?.user || null
  }

  avatarColor(name: string): string {
    const colors = ['#6C63FF','#FF6B9D','#00D4AA','#FFB800','#FF6B6B','#3498DB','#2ECC71','#E67E22']
    let h = 0
    for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h)
    return colors[Math.abs(h) % colors.length]
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
}
