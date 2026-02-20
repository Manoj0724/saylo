import { Injectable } from '@angular/core'
import { io, Socket } from 'socket.io-client'
import { Observable, Subject } from 'rxjs'
import { environment } from '../../../environments/environment'
import { AuthService } from './auth.service'

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket
  private eventBuffer: Map<string, Subject<any>> = new Map()

  constructor(private auth: AuthService) {}

  connect(): void {
    if (this.socket?.connected) return

    const userId = this.auth.getUserId()
    if (!userId) {
      console.warn('[Socket] No userId — cannot connect')
      return
    }

    console.log('[Socket] Connecting with userId:', userId)

    this.socket = io(environment.socketUrl, {
      query: { userId },
      transports: ['polling', 'websocket'],  // start with polling, upgrade to ws
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      timeout: 20000,
      forceNew: true,
    })

    this.socket.on('connect', () => {
      console.log('[Socket] ✅ Connected:', this.socket.id)
      // Flush any buffered event listeners
      this.eventBuffer.forEach((subject, event) => {
        this.socket.on(event, (data: any) => subject.next(data))
      })
    })

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason)
      if (reason === 'io server disconnect') {
        // Server kicked us — reconnect manually
        setTimeout(() => this.socket.connect(), 1000)
      }
    })

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message)
    })
  }

  disconnect(): void {
    this.socket?.disconnect()
  }

  // Generic typed event listener
  on<T>(event: string): Observable<T> {
    // If socket not ready yet, buffer the subject and attach when connected
    if (!this.socket) {
      if (!this.eventBuffer.has(event)) {
        this.eventBuffer.set(event, new Subject<T>())
      }
      return this.eventBuffer.get(event)!.asObservable()
    }

    return new Observable(observer => {
      const handler = (data: T) => observer.next(data)
      this.socket.on(event, handler)
      return () => {
        this.socket?.off(event, handler)
      }
    })
  }

  emit(event: string, data?: any): void {
    if (!this.socket?.connected) {
      console.warn('[Socket] Not connected — cannot emit:', event)
      return
    }
    this.socket.emit(event, data)
  }

  get connected(): boolean {
    return this.socket?.connected ?? false
  }

  // ── CHAT ─────────────────────────────────────────────────
  joinChat(chatId: string): void {
    console.log('[Socket] Joining chat:', chatId)
    this.emit('chat:join', { chatId })
  }

  leaveChat(chatId: string): void {
    this.emit('chat:leave', { chatId })
  }

  sendMessage(chatId: string, content: string, type = 'text', replyTo: string | null = null): void {
    this.emit('message:send', { chatId, content, type, replyTo })
  }

  sendTypingStart(chatId: string): void {
    this.emit('typing:start', { chatId })
  }

  sendTypingStop(chatId: string): void {
    this.emit('typing:stop', { chatId })
  }

  markRead(chatId: string, messageIds: string[]): void {
    this.emit('message:read', { chatId, messageIds })
  }

  reactToMessage(messageId: string, chatId: string, emoji: string): void {
    this.emit('message:react', { messageId, chatId, emoji })
  }

  // ── CALLS ────────────────────────────────────────────────
  initiateCall(chatId: string, targetUserId: string, type: 'audio' | 'video'): void {
    console.log('[Socket] call:initiate →', { chatId, targetUserId, type })
    this.emit('call:initiate', { chatId, targetUserId, type })
  }

  answerCall(callId: string): void {
    console.log('[Socket] call:answer →', callId)
    this.emit('call:answer', { callId })
  }

  declineCall(callId: string): void {
    console.log('[Socket] call:decline →', callId)
    this.emit('call:decline', { callId })
  }

  endCall(callId: string): void {
    console.log('[Socket] call:end →', callId)
    this.emit('call:end', { callId })
  }

  // ── WebRTC ────────────────────────────────────────────────
  sendOffer(callId: string, offer: RTCSessionDescriptionInit, targetUserId: string): void {
    console.log('[Socket] webrtc:offer → ', targetUserId)
    this.emit('webrtc:offer', { callId, offer, targetUserId })
  }

  sendAnswer(callId: string, answer: RTCSessionDescriptionInit, targetUserId: string): void {
    console.log('[Socket] webrtc:answer →', targetUserId)
    this.emit('webrtc:answer', { callId, answer, targetUserId })
  }

  sendIceCandidate(callId: string, candidate: RTCIceCandidate, targetUserId: string): void {
    this.emit('webrtc:ice-candidate', { callId, candidate, targetUserId })
  }

  getUserId(): string | null {
    return this.auth.getUserId()
  }
}