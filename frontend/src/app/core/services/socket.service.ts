import { Injectable, signal, NgZone } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { environment } from '../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null
  private eventBuffer = new Map<string, Subject<any>>()
  isConnected = signal(false)

  constructor(private zone: NgZone) {}

  connect(userId?: string): void {
    if (this.socket?.connected) return
    console.log('[Socket] Connecting userId:', userId)
    this.socket = io(environment.socketUrl, {
      auth: { userId },
      transports: ['polling', 'websocket'],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 30000,
      forceNew: true,
      withCredentials: true,
    })
    this.socket.on('connect', () => {
      console.log('[Socket] ✅ Connected:', this.socket?.id)
      this.zone.run(() => this.isConnected.set(true))
      this.eventBuffer.forEach((subject, event) => {
        this.socket!.on(event, (data: any) => {
          this.zone.run(() => subject.next(data))
        })
      })
    })
    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
      this.zone.run(() => this.isConnected.set(false))
    })
    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Error:', err.message)
    })
  }

  on<T>(event: string): Observable<T> {
    if (!this.eventBuffer.has(event)) {
      this.eventBuffer.set(event, new Subject<T>())
    }
    const subject = this.eventBuffer.get(event)!
    if (this.socket?.connected) {
      this.socket.on(event, (data: T) => {
        this.zone.run(() => subject.next(data))
      })
    }
    return subject.asObservable()
  }

  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('[Socket] Not connected, cannot emit:', event)
    }
  }

  joinChat(chatId: string): void { this.emit('chat:join', { chatId }); console.log('[Socket] Joining chat:', chatId) }
  leaveChat(chatId: string): void { this.emit('chat:leave', { chatId }) }
  sendMessage(chatId: string, content: string, type?: string, replyTo?: string | null): void { this.emit('message:send', { chatId, content, type: type || 'text', replyTo }) }
  sendTypingStart(chatId: string): void { this.emit('typing', { chatId, isTyping: true }) }
  sendTypingStop(chatId: string): void { this.emit('typing', { chatId, isTyping: false }) }
  sendTyping(chatId: string, isTyping: boolean): void { this.emit('typing', { chatId, isTyping }) }
  markRead(chatId: string, messageIds: string | string[]): void { this.emit('message:read', { chatId, messageIds: Array.isArray(messageIds) ? messageIds : [messageIds] }) }
  reactToMessage(messageId: string, chatId: string, emoji: string): void { this.emit('message:react', { messageId, emoji, chatId }) }
  addReaction(messageId: string, emoji: string, chatId: string): void { this.emit('message:react', { messageId, emoji, chatId }) }
  initiateCall(chatId: string, targetUserId: string, type: string): void { this.emit('call:initiate', { chatId, targetUserId, type }); console.log('[Socket] call:initiate →', { chatId, targetUserId, type }) }
  answerCall(callId: string): void { this.emit('call:answer', { callId }) }
  declineCall(callId: string): void { this.emit('call:decline', { callId }) }
  endCall(callId: string): void { this.emit('call:end', { callId }) }
  sendOffer(callId: string, offer: RTCSessionDescriptionInit, targetUserId: string): void { this.emit('webrtc:offer', { callId, offer, targetUserId }); console.log('[Socket] webrtc:offer → ', targetUserId) }
  sendAnswer(callId: string, answer: RTCSessionDescriptionInit, targetUserId: string): void { this.emit('webrtc:answer', { callId, answer, targetUserId }) }
  sendIceCandidate(callId: string, candidate: RTCIceCandidate, targetUserId: string): void { this.emit('webrtc:ice-candidate', { callId, candidate, targetUserId }) }
  disconnect(): void { this.socket?.disconnect(); this.socket = null; this.isConnected.set(false); this.eventBuffer.clear() }
}