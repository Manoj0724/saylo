import { Injectable, signal, NgZone } from '@angular/core'
import { SocketService } from './socket.service'
import { Subject, takeUntil } from 'rxjs'

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended'

export interface ActiveCall {
  callId: string
  type: 'audio' | 'video'
  remoteUserId: string
  remoteUserName: string
  chatId: string
  direction: 'outgoing' | 'incoming'
}

@Injectable({ providedIn: 'root' })
export class CallService {
  private destroy$          = new Subject<void>()
  private pc:                RTCPeerConnection | null = null
  private pendingOffer:      RTCSessionDescriptionInit | null = null
  private pendingOfferFrom:  string | null = null
  private durationTimer:     any = null
  private audioElement:      HTMLAudioElement | null = null
  private remoteStreamRef:   MediaStream = new MediaStream()

  callStatus        = signal<CallStatus>('idle')
  activeCall        = signal<ActiveCall | null>(null)
  incomingCall      = signal<ActiveCall | null>(null)
  localStream       = signal<MediaStream | null>(null)
  remoteStream      = signal<MediaStream | null>(null)
  isMuted           = signal(false)
  isCameraOff       = signal(false)
  callDuration      = signal(0)
  pendingCallerName = ''

  private readonly STUN: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
    ]
  }

  constructor(private socket: SocketService, private zone: NgZone) {
    this.listenSocket()
  }

  // ── START OUTGOING CALL ───────────────────────────────────
  async startCall(
    chatId: string,
    targetUserId: string,
    targetUserName: string,
    type: 'audio' | 'video'
  ): Promise<void> {
    if (this.callStatus() !== 'idle') { alert('Already in a call'); return }
    this.hardReset(true)

    try {
      const stream = await this.getMedia(type)
      this.zone.run(() => { this.localStream.set(stream); this.callStatus.set('calling') })

      this.socket.initiateCall(chatId, targetUserId, type)

      const sub = this.socket.on<{ callId: string }>('call:initiated').subscribe(async ({ callId }) => {
        sub.unsubscribe()
        this.zone.run(() => {
          this.activeCall.set({ callId, type, chatId, remoteUserId: targetUserId, remoteUserName: targetUserName, direction: 'outgoing' })
          this.callStatus.set('calling')
        })
        this.pc = this.createPC(callId, targetUserId, type)
        this.addTracks(stream, type)
        await this.makeOffer(callId, targetUserId, type)
      })

    } catch (err: any) {
      console.error('[Call] Start failed:', err)
      this.zone.run(() => { alert(this.mediaError(err)); this.cleanup() })
    }
  }

  // ── ANSWER INCOMING CALL ──────────────────────────────────
  async answerCall(): Promise<void> {
    const incoming = this.incomingCall()
    if (!incoming) return

    try {
      let stream: MediaStream
      let type = incoming.type

      try {
        stream = await this.getMedia(type)
      } catch (err: any) {
        if (type === 'video') {
          console.warn('[Call] Camera unavailable, falling back to audio:', err.message)
          stream = await this.getMedia('audio')
          type = 'audio'
        } else throw err
      }

      this.zone.run(() => {
        this.localStream.set(stream)
        this.activeCall.set({ ...incoming, type, direction: 'incoming' })
        this.incomingCall.set(null)
        this.callStatus.set('connected')
      })

      this.socket.answerCall(incoming.callId)
      this.pc = this.createPC(incoming.callId, incoming.remoteUserId, type)
      this.addTracks(stream, type)

      if (this.pendingOffer && this.pendingOfferFrom) {
        console.log('[WebRTC] Processing buffered offer')
        await this.processOffer(incoming.callId, this.pendingOffer, this.pendingOfferFrom, type)
        this.pendingOffer = null
        this.pendingOfferFrom = null
      }

      this.startTimer()

    } catch (err: any) {
      console.error('[Call] Answer failed:', err)
      this.zone.run(() => { alert(this.mediaError(err)); this.cleanup() })
    }
  }

  declineCall(): void {
    const inc = this.incomingCall()
    if (inc) this.socket.declineCall(inc.callId)
    this.cleanup()
  }

  endCall(): void {
    const call = this.activeCall()
    if (call) this.socket.endCall(call.callId)
    this.cleanup()
  }

  toggleMute(): void {
    const s = this.localStream()
    if (!s) return
    s.getAudioTracks().forEach(t => { t.enabled = !t.enabled })
    this.isMuted.set(!this.isMuted())
  }

  toggleCamera(): void {
    const s = this.localStream()
    if (!s) return
    s.getVideoTracks().forEach(t => { t.enabled = !t.enabled })
    this.isCameraOff.set(!this.isCameraOff())
  }

  // ── GET MEDIA ─────────────────────────────────────────────
  private async getMedia(type: 'audio' | 'video'): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 48000 },
      video: type === 'video'
        ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user', frameRate: { ideal: 30 } }
        : false,
    })
  }

  // ── ADD TRACKS TO PC ──────────────────────────────────────
  private addTracks(stream: MediaStream, type: 'audio' | 'video'): void {
    if (!this.pc) return
    // Add audio track first, then video (order matters for SDP)
    const audioTracks = stream.getAudioTracks()
    const videoTracks = stream.getVideoTracks()

    audioTracks.forEach(t => {
      console.log('[WebRTC] Adding local audio track')
      this.pc!.addTrack(t, stream)
    })

    if (type === 'video') {
      videoTracks.forEach(t => {
        console.log('[WebRTC] Adding local video track')
        this.pc!.addTrack(t, stream)
      })
    }
  }

  // ── CREATE PEER CONNECTION ────────────────────────────────
  private createPC(callId: string, targetUserId: string, type: 'audio' | 'video'): RTCPeerConnection {
    // Destroy old PC
    try {
      if (this.pc) {
        this.pc.ontrack = null
        this.pc.onicecandidate = null
        this.pc.oniceconnectionstatechange = null
        this.pc.onsignalingstatechange = null
        this.pc.close()
      }
    } catch {}
    this.pc = null

    // Fresh remote stream
    this.remoteStreamRef = new MediaStream()
    this.remoteStream.set(this.remoteStreamRef)

    const pc = new RTCPeerConnection(this.STUN)

    pc.ontrack = (e) => {
      const track = e.track
      console.log('[WebRTC] Remote track:', track.kind, '| state:', track.readyState, '| streams:', e.streams.length)

      // Use the stream from the event directly
      if (e.streams && e.streams[0]) {
        const remoteS = e.streams[0]

        // Check if track already added
        const existing = this.remoteStreamRef.getTracks().find(t => t.id === track.id)
        if (!existing) {
          this.remoteStreamRef.addTrack(track)
          console.log('[WebRTC] Added', track.kind, 'to remoteStream. Total:', this.remoteStreamRef.getTracks().length)
        }

        track.onunmute = () => {
          console.log('[WebRTC] Track unmuted:', track.kind)
          this.zone.run(() => this.remoteStream.set(new MediaStream(this.remoteStreamRef.getTracks())))
        }
      }

      // Always update signal after adding track
      this.zone.run(() => {
        const snapshot = new MediaStream(this.remoteStreamRef.getTracks())
        this.remoteStream.set(snapshot)
        console.log('[WebRTC] remoteStream updated. Tracks:', snapshot.getTracks().map(t => `${t.kind}(${t.readyState})`))

        // Play audio for audio calls
        if (type === 'audio') {
          this.playAudio(snapshot)
        }
      })
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) this.socket.sendIceCandidate(callId, e.candidate, targetUserId)
    }

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE:', pc.iceConnectionState)
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        this.zone.run(() => { this.callStatus.set('connected'); this.startTimer() })
      }
      if (pc.iceConnectionState === 'failed') {
        this.zone.run(() => { alert('Connection failed. Try again.'); this.cleanup() })
      }
    }

    pc.onsignalingstatechange = () => console.log('[WebRTC] Signaling:', pc.signalingState)

    return pc
  }

  // ── MAKE OFFER ────────────────────────────────────────────
  private async makeOffer(callId: string, targetUserId: string, type: 'audio' | 'video'): Promise<void> {
    if (!this.pc || this.pc.signalingState !== 'stable') return
    try {
      const offer = await this.pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: type === 'video',
      })
      await this.pc.setLocalDescription(offer)
      this.socket.sendOffer(callId, offer, targetUserId)
      console.log('[WebRTC] ✅ Offer sent')
    } catch (err) { console.error('[WebRTC] Offer error:', err) }
  }

  // ── PROCESS OFFER (answerer side) ─────────────────────────
  private async processOffer(callId: string, offer: RTCSessionDescriptionInit, from: string, type: 'audio' | 'video'): Promise<void> {
    if (!this.pc) return
    try {
      await this.pc.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await this.pc.createAnswer()
      await this.pc.setLocalDescription(answer)
      this.socket.sendAnswer(callId, answer, from)
      console.log('[WebRTC] ✅ Answer sent')
    } catch (err) { console.error('[WebRTC] processOffer error:', err) }
  }

  // ── PLAY AUDIO (for audio-only calls) ────────────────────
  private playAudio(stream: MediaStream): void {
    try {
      if (this.audioElement) { this.audioElement.pause(); this.audioElement.srcObject = null }
      this.audioElement = new Audio()
      this.audioElement.srcObject = stream
      this.audioElement.volume = 1.0
      this.audioElement.play()
        .then(() => console.log('[Call] ✅ Audio playing'))
        .catch(e => console.warn('[Call] Audio blocked:', e))
    } catch (e) { console.error('[Call] Audio element error:', e) }
  }

  // ── SOCKET LISTENERS ──────────────────────────────────────
  private listenSocket(): void {

    this.socket.on<{ callId: string; from: string; fromName: string; chatId: string; type: 'audio' | 'video' }>('call:incoming')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ callId, from, fromName, chatId, type }) => {
        console.log('[Call] 📞 INCOMING from:', fromName, '| type:', type)
        if (this.callStatus() !== 'idle') { this.socket.declineCall(callId); return }
        this.zone.run(() => {
          this.incomingCall.set({ callId, type, chatId, remoteUserId: from, remoteUserName: fromName || 'Someone', direction: 'incoming' })
          this.callStatus.set('ringing')
        })
      })

    this.socket.on<{ callId: string }>('call:answered')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ callId }) => console.log('[Call] ✅ Answered:', callId))

    this.socket.on<{ callId: string }>('call:declined')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.zone.run(() => { alert('Call was declined.'); this.cleanup() }))

    this.socket.on<{ callId: string; duration: number }>('call:ended')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.zone.run(() => this.cleanup()))

    this.socket.on<{ targetUserId: string }>('call:user-offline')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.zone.run(() => { alert('User is offline.'); this.cleanup() }))

    // WebRTC: offer received (answerer side)
    this.socket.on<{ callId: string; offer: RTCSessionDescriptionInit; from: string }>('webrtc:offer')
      .pipe(takeUntil(this.destroy$))
      .subscribe(async ({ callId, offer, from }) => {
        console.log('[WebRTC] 📨 Offer received | PC:', this.pc?.signalingState || 'no PC')
        const type = this.activeCall()?.type || this.incomingCall()?.type || 'audio'
        if (this.pc && this.pc.signalingState === 'stable') {
          await this.processOffer(callId, offer, from, type)
        } else {
          this.pendingOffer = offer
          this.pendingOfferFrom = from
        }
      })

    // WebRTC: answer received (caller side)
    this.socket.on<{ callId: string; answer: RTCSessionDescriptionInit }>('webrtc:answer')
      .pipe(takeUntil(this.destroy$))
      .subscribe(async ({ answer }) => {
        console.log('[WebRTC] 📨 Answer received | PC:', this.pc?.signalingState)
        try {
          if (this.pc?.signalingState === 'have-local-offer') {
            await this.pc.setRemoteDescription(new RTCSessionDescription(answer))
            console.log('[WebRTC] ✅ Remote description set')
          }
        } catch (err) { console.error('[WebRTC] Set answer error:', err) }
      })

    // WebRTC: ICE candidate
    this.socket.on<{ candidate: RTCIceCandidateInit }>('webrtc:ice-candidate')
      .pipe(takeUntil(this.destroy$))
      .subscribe(async ({ candidate }) => {
        try {
          if (this.pc?.remoteDescription) {
            await this.pc.addIceCandidate(new RTCIceCandidate(candidate))
          }
        } catch (e) { console.warn('[WebRTC] ICE warn:', e) }
      })
  }

  // ── TIMER ─────────────────────────────────────────────────
  private startTimer(): void {
    if (this.durationTimer) return
    this.callDuration.set(0)
    this.durationTimer = setInterval(() => this.zone.run(() => this.callDuration.update(d => d + 1)), 1000)
  }

  // ── HARD RESET ────────────────────────────────────────────
  private hardReset(stopStreams: boolean): void {
    try {
      if (this.pc) {
        this.pc.ontrack = null; this.pc.onicecandidate = null
        this.pc.oniceconnectionstatechange = null; this.pc.onsignalingstatechange = null
        this.pc.close()
      }
    } catch {}
    this.pc = null

    if (stopStreams) {
      try { this.localStream()?.getTracks().forEach(t => t.stop()) } catch {}
      try { this.remoteStream()?.getTracks().forEach(t => t.stop()) } catch {}
      this.localStream.set(null)
      this.remoteStream.set(null)
      this.remoteStreamRef = new MediaStream()
    }

    try {
      if (this.audioElement) { this.audioElement.pause(); this.audioElement.srcObject = null; this.audioElement = null }
    } catch {}
  }

  // ── CLEANUP ───────────────────────────────────────────────
  private cleanup(): void {
    clearInterval(this.durationTimer); this.durationTimer = null
    this.hardReset(true)
    this.pendingOffer = null; this.pendingOfferFrom = null
    this.activeCall.set(null); this.incomingCall.set(null)
    this.callStatus.set('idle'); this.callDuration.set(0)
    this.isMuted.set(false); this.isCameraOff.set(false)
  }

  private mediaError(err: any): string {
    return err.name === 'NotAllowedError' ? 'Permission denied. Allow camera/mic in browser settings.' :
           err.name === 'NotFoundError'   ? 'No camera/microphone found on this device.' :
           'Could not access camera/mic. Close other apps using it.'
  }

  destroy(): void { this.destroy$.next(); this.destroy$.complete(); this.cleanup() }
}