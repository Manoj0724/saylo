import { Injectable } from '@angular/core'
import { io, Socket } from 'socket.io-client'
import { Observable } from 'rxjs'

const SOCKET_URL = 'http://172.31.58.150:5001'

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket

  connect(userId: string): void {
    if (this.socket?.connected) return
    this.socket = io(SOCKET_URL, {
      auth: { userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      timeout: 10000,
    })
    this.socket.on('connect', () => console.log('[Socket] Connected'))
    this.socket.on('disconnect', () => console.log('[Socket] Disconnected'))
  }

  disconnect(): void { this.socket?.disconnect() }

  on<T>(event: string): Observable<T> {
    return new Observable(obs => {
      this.socket?.on(event, (data: T) => obs.next(data))
    })
  }

  emit(event: string, data?: any): void { this.socket?.emit(event, data) }

  joinChat(chatId: string): void { this.socket?.emit('chat:join', { chatId }) }
  leaveChat(chatId: string): void { this.socket?.emit('chat:leave', { chatId }) }
  sendMessage(chatId: string, content: string): void { this.socket?.emit('message:send', { chatId, content }) }
  sendTypingStart(chatId: string): void { this.socket?.emit('typing:start', { chatId }) }
  sendTypingStop(chatId: string): void { this.socket?.emit('typing:stop', { chatId }) }
  initiateCall(chatId: string, targetUserId: string, type: 'audio'|'video'): void {
    this.socket?.emit('call:initiate', { chatId, targetUserId, type })
  }
  sendOffer(callId: string, sdp: any, targetUserId: string): void {
    this.socket?.emit('webrtc:offer', { callId, sdp, targetUserId })
  }
  sendAnswer(callId: string, sdp: any, targetUserId: string): void {
    this.socket?.emit('webrtc:answer', { callId, sdp, targetUserId })
  }
  sendIce(callId: string, candidate: any, targetUserId: string): void {
    this.socket?.emit('webrtc:ice', { callId, candidate, targetUserId })
  }
  syncChats(): void { this.socket?.emit('chats:sync') }
  markRead(chatId: string, messageId: string): void {
    this.socket?.emit('message:read', { chatId, messageId })
  }
}
