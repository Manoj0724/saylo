import {
  Component, ViewChild, ElementRef,
  AfterViewChecked, OnDestroy, NgZone, ChangeDetectorRef
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { CallService } from '../../core/services/call.service'
import { Subject, takeUntil } from 'rxjs'
import { toObservable } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-call',
  standalone: true,
  imports: [CommonModule],
  template: `

<!-- ══ INCOMING RING ══ -->
@if(callSvc.callStatus()==='ringing' && callSvc.incomingCall(); as inc){
  <div class="overlay">
    <div class="ring-card">
      <div class="rp rp1"></div><div class="rp rp2"></div><div class="rp rp3"></div>
      <div class="call-av" [style.background]="grad(inc.remoteUserName)">{{ini(inc.remoteUserName)}}</div>
      <h2 class="call-name">{{inc.remoteUserName}}</h2>
      <p class="call-sub">{{inc.type==='video'?'📹 Incoming Video Call':'📞 Incoming Audio Call'}}</p>
      <div class="dots"><span></span><span></span><span></span></div>
      <div class="ring-btns">
        <button class="rb red"   (click)="callSvc.declineCall()">
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path stroke-linecap="round" d="M16.5 12.5c-.83-.83-1.71-1.5-2.5-1.5h-4c-.79 0-2.09.67-2.83 1.41L4.5 15.08"/></svg>
        </button>
        <button class="rb green" (click)="callSvc.answerCall()">
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        </button>
      </div>
    </div>
  </div>
}

<!-- ══ CALLING ══ -->
@if(callSvc.callStatus()==='calling'){
  <div class="overlay">
    <div class="center-card">
      <div class="call-av" [style.background]="grad(callSvc.activeCall()?.remoteUserName||'')">{{ini(callSvc.activeCall()?.remoteUserName||'')}}</div>
      <h2 class="call-name">{{callSvc.activeCall()?.remoteUserName}}</h2>
      <p class="call-sub">Calling...</p>
      <div class="dots"><span></span><span></span><span></span></div>
      <button class="end-pill" (click)="callSvc.endCall()">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path stroke-linecap="round" d="M16.5 12.5c-.83-.83-1.71-1.5-2.5-1.5h-4c-.79 0-2.09.67-2.83 1.41L4.5 15.08"/></svg>
        Cancel
      </button>
    </div>
  </div>
}

<!-- ══ AUDIO CALL ══ -->
@if(callSvc.callStatus()==='connected' && callSvc.activeCall()?.type==='audio'){
  <div class="overlay">
    <div class="audio-card">
      <div class="wave-wrap" [class.muted]="callSvc.isMuted()">
        @for(b of bars;track b){<div class="wb" [style.animation-delay]="(b*0.09)+'s'"></div>}
      </div>
      <div class="call-av large" [style.background]="grad(callSvc.activeCall()!.remoteUserName)">{{ini(callSvc.activeCall()!.remoteUserName)}}</div>
      <h2 class="call-name">{{callSvc.activeCall()!.remoteUserName}}</h2>
      <p class="call-timer">{{fmt(callSvc.callDuration())}}</p>
      <div class="audio-ctrls">
        <button class="ac" [class.on]="callSvc.isMuted()" (click)="callSvc.toggleMute()">
          @if(callSvc.isMuted()){<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/></svg>}
          @else{<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>}
          <span>{{callSvc.isMuted()?'Unmute':'Mute'}}</span>
        </button>
        <button class="ac end" (click)="callSvc.endCall()">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path stroke-linecap="round" d="M16.5 12.5c-.83-.83-1.71-1.5-2.5-1.5h-4c-.79 0-2.09.67-2.83 1.41L4.5 15.08"/></svg>
          <span>End</span>
        </button>
        <button class="ac">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
          <span>Speaker</span>
        </button>
      </div>
    </div>
  </div>
}

<!-- ══ VIDEO CALL ══ -->
@if(callSvc.callStatus()==='connected' && callSvc.activeCall()?.type==='video'){
  <div class="video-shell">

    <!-- Remote video -->
    <video #remoteVid class="remote-vid" autoplay playsinline></video>

    <!-- Avatar fallback when no remote video yet -->
    @if(!remoteHasVideo){
      <div class="remote-blank">
        <div class="call-av xlarge" [style.background]="grad(callSvc.activeCall()!.remoteUserName)">{{ini(callSvc.activeCall()!.remoteUserName)}}</div>
        <p class="rb-name">{{callSvc.activeCall()!.remoteUserName}}</p>
        <p class="rb-sub">Connecting video...</p>
      </div>
    }

    <!-- Local PiP -->
    <div class="local-pip" [class.cam-off]="callSvc.isCameraOff()">
      <video #localVid class="local-vid" autoplay playsinline muted></video>
      @if(callSvc.isCameraOff()){
        <div class="pip-off"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34"/></svg></div>
      }
    </div>

    <!-- Top bar -->
    <div class="vid-top">
      <div><div class="vid-name">{{callSvc.activeCall()!.remoteUserName}}</div><div class="vid-dur">{{fmt(callSvc.callDuration())}}</div></div>
      <div class="sig"><div class="sb s1"></div><div class="sb s2"></div><div class="sb s3"></div><div class="sb s4"></div></div>
    </div>

    <!-- Bottom controls -->
    <div class="vid-ctrls">
      <button class="vc" [class.off]="callSvc.isMuted()" (click)="callSvc.toggleMute()">
        @if(callSvc.isMuted()){<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/></svg>}
        @else{<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/></svg>}
      </button>
      <button class="vc end-vid" (click)="callSvc.endCall()">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path stroke-linecap="round" d="M16.5 12.5c-.83-.83-1.71-1.5-2.5-1.5h-4c-.79 0-2.09.67-2.83 1.41L4.5 15.08"/></svg>
      </button>
      <button class="vc" [class.off]="callSvc.isCameraOff()" (click)="callSvc.toggleCamera()">
        @if(callSvc.isCameraOff()){<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34"/></svg>}
        @else{<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>}
      </button>
    </div>
  </div>
}
  `,
  styles: [`
    .overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(6,9,16,.94);backdrop-filter:blur(28px);animation:fadeIn .2s ease;}

    .ring-card{position:relative;width:300px;padding:48px 28px 38px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:28px;box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 60px rgba(108,99,255,.18);display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;overflow:hidden;}
    .rp{position:absolute;border-radius:50%;border:1px solid rgba(108,99,255,.2);top:50%;left:50%;pointer-events:none;animation:rpulse 2.5s ease-out infinite;}
    .rp1{width:200px;height:200px;animation-delay:0s;}.rp2{width:290px;height:290px;animation-delay:.6s;}.rp3{width:380px;height:380px;animation-delay:1.2s;}
    @keyframes rpulse{0%{opacity:.8;transform:translate(-50%,-50%) scale(.6);}100%{opacity:0;transform:translate(-50%,-50%) scale(1.2);}}

    .call-av{position:relative;z-index:1;width:84px;height:84px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:30px;color:#fff;box-shadow:0 8px 32px rgba(108,99,255,.35);flex-shrink:0;}
    .call-av.large{width:108px;height:108px;font-size:38px;}.call-av.xlarge{width:136px;height:136px;font-size:50px;}

    .call-name{font-family:var(--font-display);font-size:21px;font-weight:700;position:relative;z-index:1;margin:0;}
    .call-sub{font-size:13px;color:var(--text-muted);position:relative;z-index:1;margin:0;}

    .dots{display:flex;gap:5px;position:relative;z-index:1;}
    .dots span{width:6px;height:6px;border-radius:50%;background:var(--accent-primary);animation:bounce 1.2s ease-in-out infinite;}
    .dots span:nth-child(2){animation-delay:.2s;}.dots span:nth-child(3){animation-delay:.4s;}
    @keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.4;}40%{transform:translateY(-7px);opacity:1;}}

    .ring-btns{display:flex;gap:26px;position:relative;z-index:1;}
    .rb{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:all .2s cubic-bezier(.34,1.56,.64,1);}
    .rb.red{background:rgba(255,107,107,.15);color:#FF6B6B;border:1px solid rgba(255,107,107,.3);}
    .rb.red:hover{background:#FF6B6B;color:#fff;transform:scale(1.12);}
    .rb.green{background:rgba(0,229,160,.15);color:#00E5A0;border:1px solid rgba(0,229,160,.3);animation:gpulse 1.3s ease infinite;}
    .rb.green:hover{background:#00E5A0;color:#fff;transform:scale(1.12);}
    @keyframes gpulse{0%,100%{box-shadow:0 0 0 0 rgba(0,229,160,.4);}50%{box-shadow:0 0 0 14px rgba(0,229,160,0);}}

    .center-card{width:280px;padding:44px 28px 36px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:28px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;}
    .end-pill{display:flex;align-items:center;gap:8px;padding:10px 24px;background:rgba(255,107,107,.12);color:#FF6B6B;border:1px solid rgba(255,107,107,.25);border-radius:30px;cursor:pointer;font-family:var(--font-body);font-size:13.5px;font-weight:600;transition:all .2s;margin-top:6px;}
    .end-pill:hover{background:#FF6B6B;color:#fff;}

    .audio-card{position:relative;width:320px;padding:52px 28px 40px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:28px;box-shadow:0 32px 80px rgba(0,0,0,.65);display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;overflow:hidden;}
    .wave-wrap{position:absolute;bottom:0;left:0;right:0;display:flex;align-items:flex-end;justify-content:center;gap:3px;padding:0 18px;height:60px;opacity:.13;pointer-events:none;}
    .wb{width:3px;min-height:4px;background:var(--accent-primary);border-radius:2px;animation:wave .9s ease-in-out infinite alternate;height:28px;}
    .wave-wrap.muted .wb{animation:none!important;height:4px!important;}
    @keyframes wave{from{transform:scaleY(.2);}to{transform:scaleY(1);}}
    .call-timer{font-family:var(--font-display);font-size:34px;font-weight:700;color:#00E5A0;letter-spacing:2px;margin:0;}
    .audio-ctrls{display:flex;gap:14px;align-items:center;position:relative;z-index:1;}
    .ac{width:58px;height:72px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;background:var(--bg-elevated);border:1px solid var(--border-subtle);cursor:pointer;color:var(--text-secondary);font-size:10px;font-weight:600;transition:all .18s;}
    .ac:hover{background:var(--bg-hover);color:var(--text-primary);}
    .ac.on{background:rgba(108,99,255,.15);color:var(--accent-primary);border-color:rgba(108,99,255,.3);}
    .ac.end{width:64px;height:64px;border-radius:50%;background:rgba(255,107,107,.15);color:#FF6B6B;border-color:rgba(255,107,107,.3);}
    .ac.end:hover{background:#FF6B6B;color:#fff;transform:scale(1.08);}

    .video-shell{position:fixed;inset:0;z-index:9999;background:#000;animation:fadeIn .2s ease;}
    .remote-vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
    .remote-blank{position:absolute;inset:0;background:linear-gradient(135deg,#0D1117,#0f172a);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;}
    .rb-name{font-family:var(--font-display);font-size:22px;font-weight:700;color:#fff;margin:0;}
    .rb-sub{font-size:13px;color:rgba(255,255,255,.4);margin:0;}
    .local-pip{position:absolute;bottom:100px;right:18px;width:156px;height:118px;border-radius:16px;overflow:hidden;border:2px solid rgba(255,255,255,.18);box-shadow:0 8px 32px rgba(0,0,0,.55);background:#1a1a2e;z-index:10;}
    .local-vid{width:100%;height:100%;object-fit:cover;transform:scaleX(-1);}
    .pip-off{position:absolute;inset:0;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;color:var(--text-muted);}
    .vid-top{position:absolute;top:0;left:0;right:0;padding:22px 24px;background:linear-gradient(to bottom,rgba(0,0,0,.8),transparent);display:flex;align-items:flex-start;justify-content:space-between;z-index:10;}
    .vid-name{font-family:var(--font-display);font-size:19px;font-weight:700;color:#fff;}
    .vid-dur{font-size:13px;color:rgba(255,255,255,.6);margin-top:2px;}
    .sig{display:flex;align-items:flex-end;gap:2px;padding-top:4px;}
    .sb{width:4px;border-radius:2px;background:#00E5A0;opacity:.9;}
    .s1{height:5px;}.s2{height:9px;}.s3{height:13px;}.s4{height:18px;}
    .vid-ctrls{position:absolute;bottom:0;left:0;right:0;padding:24px 24px 32px;background:linear-gradient(to top,rgba(0,0,0,.85),transparent);display:flex;justify-content:center;gap:18px;align-items:center;z-index:10;}
    .vc{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);color:#fff;cursor:pointer;transition:all .18s;backdrop-filter:blur(12px);}
    .vc:hover{background:rgba(255,255,255,.25);transform:scale(1.08);}
    .vc.off{background:rgba(255,107,107,.3);border-color:rgba(255,107,107,.5);color:#FF6B6B;}
    .end-vid{width:62px!important;height:62px!important;background:#FF6B6B!important;border-color:#FF6B6B!important;box-shadow:0 4px 24px rgba(255,107,107,.5);}
    .end-vid:hover{transform:scale(1.12)!important;}
    @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  `]
})
export class CallComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('localVid')  localVid!:  ElementRef<HTMLVideoElement>
  @ViewChild('remoteVid') remoteVid!: ElementRef<HTMLVideoElement>

  private destroy$     = new Subject<void>()
  private ringInterval: any = null
  private audioCtx:    AudioContext | null = null

  // Track whether remote video is live
  remoteHasVideo = false

  bars = Array.from({ length: 22 }, (_, i) => i)

  constructor(
    public callSvc: CallService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    // Ring on incoming
    toObservable(callSvc.callStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (status === 'ringing') this.startRing()
        else this.stopRing()
      })

    // Local stream → local video
    toObservable(callSvc.localStream)
      .pipe(takeUntil(this.destroy$))
      .subscribe(stream => {
        this.tryAttach(this.localVid, stream, 'local')
        setTimeout(() => this.tryAttach(this.localVid, stream, 'local'), 300)
      })

    // Remote stream → remote video
    toObservable(callSvc.remoteStream)
      .pipe(takeUntil(this.destroy$))
      .subscribe(stream => {
        if (!stream) return
        console.log('[CallUI] Remote stream signal fired, tracks:', stream.getTracks().map(t => `${t.kind}(${t.readyState})`))

        // Update video flag
        this.remoteHasVideo = stream.getVideoTracks().some(t => t.readyState === 'live')
        this.cdr.detectChanges()

        // Attach immediately and with retries
        this.tryAttach(this.remoteVid, stream, 'remote')
        setTimeout(() => this.tryAttach(this.remoteVid, stream, 'remote'), 200)
        setTimeout(() => this.tryAttach(this.remoteVid, stream, 'remote'), 600)
        setTimeout(() => this.tryAttach(this.remoteVid, stream, 'remote'), 1200)
        setTimeout(() => this.tryAttach(this.remoteVid, stream, 'remote'), 2500)
      })
  }

  ngAfterViewChecked(): void {
    // Always sync streams to video elements
    const local  = this.callSvc.localStream()
    const remote = this.callSvc.remoteStream()
    if (local)  this.tryAttach(this.localVid,  local,  'local')
    if (remote) this.tryAttach(this.remoteVid, remote, 'remote')
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.stopRing()
  }

  private tryAttach(
    ref: ElementRef<HTMLVideoElement> | undefined,
    stream: MediaStream | null,
    label: string
  ): void {
    if (!ref?.nativeElement || !stream) return
    const el = ref.nativeElement

    if (el.srcObject !== stream) {
      console.log(`[CallUI] Attaching ${label} stream:`, stream.getTracks().map(t => `${t.kind}(${t.readyState})`).join(', '))
      el.srcObject = stream
    }

    if (el.paused) {
      el.play().catch(e => {
        if (e.name !== 'AbortError') console.warn(`[CallUI] ${label} play():`, e.message)
      })
    }

    // Update video flag after attaching
    if (label === 'remote') {
      const hasVideo = stream.getVideoTracks().some(t => t.readyState === 'live')
      if (this.remoteHasVideo !== hasVideo) {
        this.remoteHasVideo = hasVideo
        this.cdr.detectChanges()
      }
    }
  }

  // ── RING TONE ─────────────────────────────────────────────
  private startRing(): void {
    this.stopRing()
    try {
      this.audioCtx = new AudioContext()
      const play = () => {
        if (!this.audioCtx) return
        const t = this.audioCtx.currentTime
        const osc = this.audioCtx.createOscillator()
        const gain = this.audioCtx.createGain()
        osc.connect(gain); gain.connect(this.audioCtx.destination)
        osc.frequency.setValueAtTime(440, t)
        osc.frequency.setValueAtTime(490, t + 0.35)
        osc.frequency.setValueAtTime(440, t + 0.70)
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.4, t + 0.05)
        gain.gain.setValueAtTime(0.4, t + 0.95)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.1)
        osc.start(t); osc.stop(t + 1.15)
      }
      play()
      this.ringInterval = setInterval(play, 2200)
    } catch (e) { console.warn('[Ring]', e) }
  }

  private stopRing(): void {
    clearInterval(this.ringInterval); this.ringInterval = null
    try { this.audioCtx?.close() } catch {}
    this.audioCtx = null
  }

  fmt(s: number): string {
    return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  }
  ini(name: string): string {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  }
  grad(name: string): string {
    const g = ['linear-gradient(135deg,#6C63FF,#00D4FF)','linear-gradient(135deg,#FF6B9D,#FFB800)','linear-gradient(135deg,#00E5A0,#00D4FF)','linear-gradient(135deg,#FFB800,#FF6B9D)','linear-gradient(135deg,#8B5CF6,#EC4899)']
    let h = 0
    for (const c of (name||'')) h = c.charCodeAt(0) + ((h<<5)-h)
    return g[Math.abs(h)%g.length]
  }
}