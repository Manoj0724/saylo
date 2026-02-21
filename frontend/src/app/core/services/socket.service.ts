import { Injectable, OnDestroy } from '@angular/core'
import { io, Socket } from 'socket.io-client'
import { Observable, BehaviorSubject } from 'rxjs'
import { environment } from '../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket!: Socket
  private connected$ = new BehaviorSubject<boolean>(false)
  readonly isConnected$ = this.connected$.asObservable()

  connect(userId: string): void {
    if (this.socket?.connected) return
    this.socket = io(environment.socketUrl, {
      auth: { userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
    })
    this.socket.on('connect',    () => { this.connected$.next(true); this.socket.emit('user:online', userId) })
    this.socket.on('disconnect', () =>   this.connected$.next(false))
  }

  disconnect(): void {
    if (this.socket) { this.socket.disconnect(); this.connected$.next(false) }
  }

  emit(event: string, data?: unknown): void {
    this.socket?.emit(event, data)
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>(obs => {
      this.socket?.on(event, (d: T) => obs.next(d))
      return () => { this.socket?.off(event) }
    })
  }

  // ── Chat ──────────────────────────────────────────────────
  joinChat(chatId: string):  void { this.emit('chat:join',  chatId) }
  leaveChat(chatId: string): void { this.emit('chat:leave', chatId) }
  sendMessage(chatId: string, message: unknown): void {
    this.emit('message:send', { chatId, message })
  }

  // ── Typing ────────────────────────────────────────────────
  sendTypingStart(chatId: string, userId: string, userName: string): void {
    this.emit('typing:start', { chatId, userId, userName })
  }
  sendTypingStop(chatId: string, userId: string): void {
    this.emit('typing:stop', { chatId, userId })
  }

  // ── Calls ─────────────────────────────────────────────────

  // call.service L63: initiateCall(chatId, targetUserId, type) — exactly 3 args
  initiateCall(chatId: string, targetUserId: string, type: 'audio' | 'video'): void {
    this.emit('call:initiate', { chatId, targetUserId, type })
  }

  // call.service L108: answerCall(incoming.callId) — exactly 1 arg
  answerCall(callId: string): void {
    this.emit('call:answer', { callId })
  }

  // call.service L129 & L302: declineCall(callId) — exactly 1 arg
  declineCall(callId: string): void {
    this.emit('call:decline', { callId })
  }

  // call.service ~L150: endCall(call.callId) — exactly 1 arg
  endCall(callId: string): void {
    this.emit('call:end', { callId })
  }

  // ── WebRTC ────────────────────────────────────────────────

  // call.service L238: sendOffer(callId, offer, targetUserId) — exactly 3 args
  sendOffer(callId: string, sdp: RTCSessionDescriptionInit, targetUserId: string): void {
    this.emit('webrtc:offer', { callId, sdp, targetUserId })
  }

  // call.service L265: sendAnswer(callId, answer, from) — exactly 3 args
  sendAnswer(callId: string, sdp: RTCSessionDescriptionInit, targetUserId: string): void {
    this.emit('webrtc:answer', { callId, sdp, targetUserId })
  }

  // call.service L277: sendIceCandidate(callId, e.candidate, targetUserId) — exactly 3 args
  sendIceCandidate(callId: string, candidate: RTCIceCandidate, targetUserId: string): void {
    this.emit('webrtc:ice-candidate', { callId, candidate, targetUserId })
  }

  ngOnDestroy(): void { this.disconnect() }
}