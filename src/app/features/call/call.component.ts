import {
  Component, OnInit, OnDestroy, signal, Input, Output,
  EventEmitter, inject, ViewChild, ElementRef, NgZone
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { SocketService } from '../../core/services/socket.service'
import { Subject, takeUntil, take } from 'rxjs'

export interface CallState {
  callId: string
  type: 'audio' | 'video'
  direction: 'incoming' | 'outgoing'
  status: 'ringing' | 'connected' | 'ended'
  targetUserId: string
  targetName: string
  targetColor: string
  targetInitials: string
}

function createRingtone(ctx: AudioContext): () => void {
  let stopped = false
  const playRing = () => {
    if (stopped) return
    const ringOnce = (startTime: number) => {
      const osc  = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); osc2.connect(gain); gain.connect(ctx.destination)
      osc.type  = 'sine'; osc.frequency.setValueAtTime(440, startTime)
      osc2.type = 'sine'; osc2.frequency.setValueAtTime(480, startTime)
      osc.frequency.linearRampToValueAtTime(460, startTime + 0.05)
      osc.frequency.linearRampToValueAtTime(440, startTime + 0.1)
      osc.frequency.linearRampToValueAtTime(460, startTime + 0.15)
      osc.frequency.linearRampToValueAtTime(440, startTime + 0.2)
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02)
      gain.gain.setValueAtTime(0.22, startTime + 0.38)
      gain.gain.linearRampToValueAtTime(0, startTime + 0.4)
      osc.start(startTime); osc.stop(startTime + 0.42)
      osc2.start(startTime); osc2.stop(startTime + 0.42)
    }
    const now = ctx.currentTime
    ringOnce(now)
    ringOnce(now + 0.5)
    setTimeout(() => { if (!stopped) playRing() }, 3500)
  }
  playRing()
  return () => { stopped = true }
}

@Component({
  selector: 'app-call',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="cs" [class.video]="call.type==='video'">
  <div class="bg"></div>

  <!-- ✅ FIX: audio element always present, never muted -->
  <audio #remoteAudio autoplay playsinline></audio>

  @if(call.type==='video'){
    <video #remoteVideo class="rv" autoplay playsinline></video>
    @if(!hasRemote()){
      <div class="rph"><div class="rav" [style.background]="call.targetColor">{{call.targetInitials}}</div></div>
    }
    <video #localVideo class="lv" autoplay playsinline muted></video>
  }

  <div class="top">
    @if(call.type==='audio'){
      <div class="aav" [style.background]="call.targetColor">{{call.targetInitials}}</div>
    }
    <div class="cname">{{call.targetName}}</div>
    <div class="cst">
      @if(st()==='ringing' && call.direction==='outgoing'){<span class="dots"><span></span><span></span><span></span></span> Calling}
      @else if(st()==='ringing' && call.direction==='incoming'){Incoming {{call.type}} call}
      @else if(st()==='connected'){{{timer()}}}
      @else{Call ended}
    </div>
  </div>

  @if(st()==='ringing' && call.direction==='incoming'){
    <div class="acts inc">
      <div class="aw"><button class="ab dec" (click)="decline()"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/><line x1="1" y1="1" x2="23" y2="23"/></svg></button><span>Decline</span></div>
      <div class="aw"><button class="ab ans" (click)="answer()"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></button><span>Answer</span></div>
    </div>
  }

  @if(st()==='connected' || (st()==='ringing' && call.direction==='outgoing')){
    <div class="acts act">
      <div class="aw"><button class="ab" [class.off]="muted()" (click)="toggleMute()">
        @if(!muted()){<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>}
        @else{<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8"/></svg>}
      </button><span>{{muted()?'Unmute':'Mute'}}</span></div>

      @if(call.type==='video'){
        <div class="aw"><button class="ab" [class.off]="videoOff()" (click)="toggleVideo()">
          @if(!videoOff()){<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
          @else{<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}
        </button><span>{{videoOff()?'Cam On':'Cam Off'}}</span></div>
      }

      <div class="aw"><button class="ab end" (click)="end()"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.07-3.07M2 2l20 20"/></svg></button><span>End</span></div>
    </div>
  }
</div>
  `,
  styles: [`
    .cs{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-family:'Plus Jakarta Sans',sans-serif;touch-action:manipulation;}
    .bg{position:absolute;inset:0;background:linear-gradient(160deg,#0d0d1a 0%,#1a0d2e 50%,#0d1a1a 100%);z-index:0;}
    .cs.video .bg{background:#000;}
    .rv{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;}
    .rph{position:absolute;inset:0;background:linear-gradient(160deg,#0d0d1a,#1a0d2e);display:flex;align-items:center;justify-content:center;z-index:1;}
    .rav{width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:800;color:#fff;}
    .lv{position:absolute;top:env(safe-area-inset-top, 20px);right:16px;width:90px;height:120px;border-radius:14px;object-fit:cover;z-index:10;border:2px solid rgba(255,255,255,.4);background:#111;margin-top:80px;}
    .top{position:relative;z-index:5;display:flex;flex-direction:column;align-items:center;padding-top:calc(env(safe-area-inset-top,0px) + 70px);gap:12px;}
    .aav{width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:800;color:#fff;box-shadow:0 0 0 12px rgba(255,255,255,.07),0 0 0 24px rgba(255,255,255,.04);animation:rpulse 2.2s ease-in-out infinite;}
    .cname{font-size:28px;font-weight:800;color:#fff;letter-spacing:-.5px;text-shadow:0 2px 16px rgba(0,0,0,.5);}
    .cst{font-size:14px;color:rgba(255,255,255,.65);display:flex;align-items:center;gap:6px;letter-spacing:.2px;}
    .dots{display:flex;gap:3px;align-items:center;}
    .dots span{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.7);animation:dot 1.4s ease infinite;}
    .dots span:nth-child(2){animation-delay:.2s;}
    .dots span:nth-child(3){animation-delay:.4s;}
    @keyframes dot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
    .acts{position:relative;z-index:5;display:flex;gap:20px;padding:28px 20px;padding-bottom:calc(28px + env(safe-area-inset-bottom,0px));}
    .acts.inc{gap:52px;}
    .aw{display:flex;flex-direction:column;align-items:center;gap:8px;}
    .aw span{font-size:11px;color:rgba(255,255,255,.7);font-weight:600;letter-spacing:.3px;}
    .ab{width:62px;height:62px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s,box-shadow .15s;touch-action:manipulation;-webkit-tap-highlight-color:transparent;min-height:unset;min-width:unset;background:rgba(255,255,255,.16);backdrop-filter:blur(16px);}
    .ab svg{width:24px;height:24px;}
    .ab:active{transform:scale(.92);}
    .ab.off{background:rgba(255,255,255,.07);opacity:.55;}
    .ab.end{background:#FF3B30;box-shadow:0 4px 20px rgba(255,59,48,.45);}
    .ab.end:active{box-shadow:0 2px 10px rgba(255,59,48,.3);}
    .ab.ans{background:#34C759;box-shadow:0 4px 20px rgba(52,199,89,.45);}
    .ab.ans:active{box-shadow:0 2px 10px rgba(52,199,89,.3);}
    .ab.dec{background:#FF3B30;box-shadow:0 4px 20px rgba(255,59,48,.45);}
    @keyframes rpulse{0%,100%{box-shadow:0 0 0 12px rgba(255,255,255,.07),0 0 0 24px rgba(255,255,255,.04)}50%{box-shadow:0 0 0 18px rgba(255,255,255,.1),0 0 0 36px rgba(255,255,255,.05)}}
  `]
})
export class CallComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo')  localVideoEl!:  ElementRef<HTMLVideoElement>
  @ViewChild('remoteVideo') remoteVideoEl!: ElementRef<HTMLVideoElement>
  @ViewChild('remoteAudio') remoteAudioEl!: ElementRef<HTMLAudioElement>

  @Input() call!: CallState
  @Output() callEnded = new EventEmitter<void>()

  private socket   = inject(SocketService)
  private zone     = inject(NgZone)
  private destroy$ = new Subject<void>()

  private pc!: RTCPeerConnection
  private localStream!: MediaStream
  private remoteStream = new MediaStream()   // ✅ FIX: single persistent remote stream
  private timerInterval: any
  private secs = 0
  private pendingCandidates: RTCIceCandidateInit[] = []
  private answered  = false
  private answering = false
  private audioCtx!: AudioContext
  private stopRingtone!: () => void

  muted     = signal(false)
  videoOff  = signal(false)
  hasRemote = signal(false)
  timer     = signal('00:00')
  st        = signal<'ringing'|'connected'|'ended'>('ringing')

  ngOnInit(): void {
    this.startRingtone()
    this.listenSocket()
    if (this.call.direction === 'outgoing') this.setupMedia()
  }

  ngOnDestroy(): void {
    this.stopRingtoneSound()
    this.destroy$.next(); this.destroy$.complete()
    this.cleanup()
  }

  private startRingtone(): void {
    try { this.audioCtx = new AudioContext(); this.stopRingtone = createRingtone(this.audioCtx) } catch {}
  }

  private stopRingtoneSound(): void {
    try { this.stopRingtone?.() } catch {}
    try { this.audioCtx?.close() } catch {}
  }

  // ✅ FIX: dedicated method to attach audio with retries + autoplay unlock
  private attachRemoteAudio(n = 0): void {
    const el = this.remoteAudioEl?.nativeElement
    if (el) {
      el.srcObject = this.remoteStream
      el.volume = 1
      el.muted = false
      const p = el.play()
      if (p) {
        p.catch(err => {
          console.warn('[Audio] play() blocked:', err.name)
          // ✅ retry after short delay — browser may need a moment
          if (n < 5) setTimeout(() => this.attachRemoteAudio(n + 1), 300)
        })
      }
    } else if (n < 20) {
      setTimeout(() => this.attachRemoteAudio(n + 1), 150)
    }
  }

  private listenSocket(): void {
    // Caller: callee answered → send offer
    this.socket.on<any>('call:answered').pipe(takeUntil(this.destroy$), take(1)).subscribe(async () => {
      if (this.answered) return
      this.answered = true
      this.stopRingtoneSound()
      this.zone.run(() => { this.st.set('connected'); this.startTimer() })
      let w = 0
      while (!this.localStream && w < 6000) { await new Promise(r => setTimeout(r, 100)); w += 100 }
      this.setupPeerConnection()
      await new Promise(r => setTimeout(r, 200))
      const offer = await this.pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.call.type === 'video'
      })
      await this.pc.setLocalDescription(offer)
      this.socket.sendOffer(this.call.callId, offer, this.call.targetUserId)
    })

    // Callee: receive offer
    this.socket.on<any>('webrtc:offer').pipe(takeUntil(this.destroy$)).subscribe(async ({sdp}) => {
      if (!this.pc) { await this.waitForPC() }
      if (!this.pc) return
      await this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
      for (const c of this.pendingCandidates) {
        await this.pc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {})
      }
      this.pendingCandidates = []
      const answer = await this.pc.createAnswer()
      await this.pc.setLocalDescription(answer)
      this.socket.sendAnswer(this.call.callId, answer, this.call.targetUserId)
    })

    // Caller: receive answer
    this.socket.on<any>('webrtc:answer').pipe(takeUntil(this.destroy$)).subscribe(async ({sdp}) => {
      if (!this.pc) return
      await this.pc.setRemoteDescription(new RTCSessionDescription(sdp)).catch(console.error)
    })

    // ICE candidates
    this.socket.on<any>('webrtc:ice').pipe(takeUntil(this.destroy$)).subscribe(async ({candidate}) => {
      if (!candidate) return
      if (!this.pc || !this.pc.remoteDescription) { this.pendingCandidates.push(candidate); return }
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {})
    })

    this.socket.on<any>('call:declined').pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.zone.run(() => this.endCall())
    })
    this.socket.on<any>('call:ended').pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.zone.run(() => this.endCall())
    })
  }

  private waitForPC(): Promise<void> {
    return new Promise(r => {
      let t = 0
      const i = setInterval(() => { t++; if (this.pc || t > 20) { clearInterval(i); r() } }, 150)
    })
  }

  async answer(): Promise<void> {
    if (this.answering) return
    this.answering = true
    this.stopRingtoneSound()
    // ✅ FIX: unlock audio context on user gesture (answer button click)
    try { if (this.audioCtx?.state === 'suspended') await this.audioCtx.resume() } catch {}
    this.socket.emit('call:answer', { callId: this.call.callId, targetUserId: this.call.targetUserId })
    this.zone.run(() => { this.st.set('connected'); this.startTimer() })
    await this.setupMedia()
    this.setupPeerConnection()
    // ✅ FIX: start attaching audio right after setup
    this.attachRemoteAudio()
  }

  decline(): void {
    this.stopRingtoneSound()
    this.socket.emit('call:decline', { callId: this.call.callId, targetUserId: this.call.targetUserId })
    this.callEnded.emit()
  }

  end(): void {
    this.stopRingtoneSound()
    this.socket.emit('call:end', { callId: this.call.callId, targetUserId: this.call.targetUserId })
    this.endCall()
  }

  private async setupMedia(): Promise<void> {
    this.localStream?.getTracks().forEach(t => t.stop())
    const isVideo = this.call.type === 'video'
    const attempts = [
      { audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: isVideo ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false },
      { audio: { echoCancellation: true, noiseSuppression: true }, video: isVideo },
      { audio: true, video: false }
    ]
    for (const c of attempts) {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia(c as any)
        console.log('[Media] Got tracks:', this.localStream.getTracks().map(t => t.kind))
        if (isVideo) {
          this.attachEl(() => this.localVideoEl?.nativeElement, this.localStream)
        }
        return
      } catch (e: any) { console.warn('[Media] Attempt failed:', e.name, c) }
    }
    console.error('[Media] All attempts failed')
  }

  private setupPeerConnection(): void {
    this.pc = new RTCPeerConnection({
      iceServers: [
        { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
        { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
        { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
        { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
      ]
    })

    // ✅ FIX: add tracks to existing remoteStream, not a new one each time
    this.pc.ontrack = (e) => {
      console.log('[WebRTC] Got remote track:', e.track.kind)
      e.track.onunmute = () => {
        this.remoteStream.addTrack(e.track)
        this.zone.run(() => {
          this.hasRemote.set(true)
          if (e.track.kind === 'audio') {
            // ✅ FIX: attach audio every time an audio track arrives
            this.attachRemoteAudio()
          }
          if (e.track.kind === 'video' && this.call.type === 'video') {
            this.attachEl(() => this.remoteVideoEl?.nativeElement, this.remoteStream)
          }
        })
      }
      // also try immediately in case onunmute already fired
      this.remoteStream.addTrack(e.track)
      this.zone.run(() => {
        this.hasRemote.set(true)
        if (e.track.kind === 'audio') {
          this.attachRemoteAudio()
        }
        if (e.track.kind === 'video' && this.call.type === 'video') {
          this.attachEl(() => this.remoteVideoEl?.nativeElement, this.remoteStream)
        }
      })
    }

    this.localStream?.getTracks().forEach(t => {
      this.pc.addTrack(t, this.localStream)
      console.log('[WebRTC] Added local track:', t.kind)
    })

    this.pc.onicecandidate = (e) => {
      if (e.candidate) this.socket.sendIce(this.call.callId, e.candidate.toJSON(), this.call.targetUserId)
    }

    this.pc.onconnectionstatechange = () => {
      console.log('[WebRTC] Connection state:', this.pc.connectionState)
      if (this.pc.connectionState === 'connected') {
        this.zone.run(() => {
          this.st.set('connected')
          if (!this.timerInterval) this.startTimer()
          // ✅ FIX: re-attach audio when connection confirmed
          this.attachRemoteAudio()
        })
      }
    }

    this.pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE state:', this.pc.iceConnectionState)
    }
  }

  private attachEl(getEl: () => HTMLVideoElement | null | undefined, stream: MediaStream, n = 0): void {
    const el = getEl()
    if (el) { el.srcObject = stream; el.play().catch(() => {}) }
    else if (n < 25) setTimeout(() => this.attachEl(getEl, stream, n + 1), 150)
  }

  toggleMute(): void {
    this.muted.update(m => !m)
    this.localStream?.getAudioTracks().forEach(t => t.enabled = !this.muted())
  }

  toggleVideo(): void {
    this.videoOff.update(v => !v)
    this.localStream?.getVideoTracks().forEach(t => t.enabled = !this.videoOff())
  }

  private startTimer(): void {
    this.secs = 0; clearInterval(this.timerInterval)
    this.timerInterval = setInterval(() => {
      this.secs++
      const m = Math.floor(this.secs / 60).toString().padStart(2, '0')
      const s = (this.secs % 60).toString().padStart(2, '0')
      this.zone.run(() => this.timer.set(`${m}:${s}`))
    }, 1000)
  }

  private endCall(): void {
    this.st.set('ended')
    clearInterval(this.timerInterval)
    this.cleanup()
    setTimeout(() => this.callEnded.emit(), 1000)
  }

  private cleanup(): void {
    clearInterval(this.timerInterval)
    this.localStream?.getTracks().forEach(t => t.stop())
    try { this.pc?.close() } catch {}
    const a = this.remoteAudioEl?.nativeElement
    if (a) { a.srcObject = null; a.pause() }
  }
}
