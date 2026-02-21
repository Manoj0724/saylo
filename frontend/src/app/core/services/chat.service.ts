import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { User } from './auth.service'

// ── Interfaces ────────────────────────────────────────────────

export interface Participant {
  user:     User
  role:     'admin' | 'member'
  joinedAt: string
  isMuted:  boolean
}

export interface Chat {
  _id:             string
  type:            'direct' | 'group'
  name?:           string
  participants:    Participant[]
  lastMessage?:    Message
  lastMessageText?: string
  lastActivity:    string
  isActive:        boolean
  unread?:         number
}

export interface Message {
  _id:       string
  chat:      string
  sender:    User
  content:   string
  type:      string
  isDeleted: boolean
  isEdited:  boolean
  readBy:    { user: string; readAt: string }[]
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data:    T
}

// ── Service ───────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ChatService {
  private chatApi    = `${environment.apiUrl}/chats`
  private messageApi = `${environment.apiUrl}/messages`
  private userApi    = `${environment.apiUrl}/users`

  constructor(private http: HttpClient) {}

  // Get all my chats
  getChats(): Observable<ApiResponse<Chat[]>> {
    return this.http.get<ApiResponse<Chat[]>>(this.chatApi)
  }

  // Start or get existing direct chat with a user
  createOrGetDirectChat(targetUserId: string): Observable<ApiResponse<Chat>> {
    return this.http.post<ApiResponse<Chat>>(`${this.chatApi}/direct`, { targetUserId })
  }

  // Create group chat
  createGroupChat(name: string, participantIds: string[]): Observable<ApiResponse<Chat>> {
    return this.http.post<ApiResponse<Chat>>(`${this.chatApi}/group`, { name, participantIds })
  }

  // Delete / leave a chat
  deleteChat(chatId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.chatApi}/${chatId}`)
  }

  // Get all messages in a chat
  getMessages(chatId: string, page = 1): Observable<ApiResponse<Message[]>> {
    return this.http.get<ApiResponse<Message[]>>(`${this.messageApi}/${chatId}?page=${page}&limit=50`)
  }

  // Send a message
  sendMessage(chatId: string, content: string): Observable<ApiResponse<Message>> {
    return this.http.post<ApiResponse<Message>>(`${this.messageApi}/${chatId}`, { content })
  }

  // Delete a message
  deleteMessage(messageId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.messageApi}/${messageId}`)
  }

  // Mark messages as read
  markAsRead(chatId: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.messageApi}/${chatId}/read`, {})
  }

  // Get all users (for starting new chats)
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.userApi)
  }

  // Search users
  searchUsers(query: string): Observable<ApiResponse<{ users: User[] }>> {
    return this.http.get<ApiResponse<{ users: User[] }>>(`${this.userApi}/search?q=${query}`)
  }
}