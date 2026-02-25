import {
  Component, OnInit, OnDestroy, signal, computed,
  ViewChild, ElementRef, AfterViewChecked, NgZone, inject, HostListener, ChangeDetectorRef
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Subject, takeUntil } from 'rxjs'
import { AuthService } from '../../core/services/auth.service'
import { ChatService, Chat, Message } from '../../core/services/chat.service'
import { SocketService } from '../../core/services/socket.service'
import { CallComponent, CallState } from '../call/call.component'

const EMOJIS = [
  '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚',
  '😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️',
  '😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓',
  '🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵',
  '👍','👎','👏','🙌','🤝','👊','✊','🤛','🤜','🤞','✌️','🤟','🤘','👌','🤌','🤏','👈','👉','👆','👇',
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️',
  '🎉','🎊','🎈','🎁','🎂','🍕','🍔','🍟','🌮','🌯','🍜','🍝','🍛','🍣','🍱','🍩','🍪','🍫','🍬','🍭',
  '🌍','🌎','🌏','🌙','⭐','🌟','💫','✨','🌈','⛅','🌤️','🔥','💧','🌊','🌸','🌺','🌻','🌹','🍀','🌿',
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧',
  '🚀','✈️','🚗','🚕','🚙','🏎️','🚓','🚑','🚒','🛻','🚚','🏍️','🛵','🚲','⚽','🏀','🎮','🎵','🎸','🎯',
]
const CATS = [
  {i:'😀',l:'Smileys',s:0,e:40},{i:'👍',l:'Gestures',s:40,e:60},{i:'❤️',l:'Hearts',s:60,e:80},
  {i:'🎉',l:'Objects',s:80,e:100},{i:'🌍',l:'Nature',s:100,e:120},{i:'🐶',l:'Animals',s:120,e:140},{i:'🚀',l:'More',s:140,e:160},
]

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, CallComponent],
  template: `
<div class="app">

  @if(activeCall()){ <app-call [call]="activeCall()!" (callEnded)="onCallEnded()"/> }

  @if(incomingCall() && !activeCall()){
    <div class="ring-toast" (click)="answerIncoming()">
      <div class="rt-av" [style.background]="incomingCall()!.targetColor">{{incomingCall()!.targetInitials}}</div>
      <div class="rt-info">
        <div class="rt-name">{{incomingCall()!.targetName}}</div>
        <div class="rt-sub">{{incomingCall()!.type==='video'?'📹':'📞'}} Incoming {{incomingCall()!.type}} call</div>
      </div>
      <button class="rt-dec" (click)="$event.stopPropagation();declineIncoming()">✕</button>
      <button class="rt-ans" (click)="$event.stopPropagation();answerIncoming()">{{incomingCall()!.type==='video'?'📹':'📞'}}</button>
    </div>
  }

  <!-- SIDEBAR -->
  <aside class="sb" [class.open]="!activeChat() || !isMobile()">
    <div class="sb-hdr">
      <div class="logo"><div class="logo-dot"></div>Saylo</div>
      <div class="sb-hdr-acts">
        <button class="hbtn" (click)="showSearch.set(true)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="my-av" [style.background]="chatSvc.avatarColor(me()?.name||'U')" (click)="logout()">{{chatSvc.initials(me()?.name||'U')}}</div>
      </div>
    </div>

    <div class="sb-me">
      <div class="me-av" [style.background]="chatSvc.avatarColor(me()?.name||'U')">{{chatSvc.initials(me()?.name||'U')}}</div>
      <div class="me-info"><div class="me-name">{{me()?.name}}</div><div class="me-st"><span class="online-dot"></span>Online</div></div>
    </div>

    <div class="sb-search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input placeholder="Search conversations" [(ngModel)]="filterQ">
    </div>

    @if(showSearch()){
      <div class="new-chat-panel">
        <div class="ncp-hdr">
          <button class="back-btn" (click)="showSearch.set(false);peopleQ='';people.set([])">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span>New Chat</span>
        </div>
        <div class="ncp-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search by name or email..." [(ngModel)]="peopleQ" (ngModelChange)="findPeople($event)" autofocus>
        </div>
        @if(searching()){ <div class="ncp-load"><div class="spin"></div></div> }
        @for(u of people(); track u._id){
          <div class="ncp-user" (click)="startChat(u._id)">
            <div class="u-av" [style.background]="chatSvc.avatarColor(u.name)">{{chatSvc.initials(u.name)}}</div>
            <div><div class="u-name">{{u.name}}</div><div class="u-email">{{u.email}}</div></div>
          </div>
        }
        @if(!searching() && peopleQ && !people().length){ <div class="ncp-empty">No users found</div> }
        @if(!peopleQ){ <div class="ncp-hint">Search to start a new conversation</div> }
      </div>
    }

    <div class="chat-list">
      @if(loading()){
        @for(i of [1,2,3,4]; track i){
          <div class="ske"><div class="ske-av"></div><div class="ske-body"><div class="ske-l"></div><div class="ske-s"></div></div></div>
        }
      }
      @else if(!filtered().length){
        <div class="no-chats"><div class="nc-ico">💬</div><p>No conversations</p><button class="start-btn" (click)="showSearch.set(true)">Start chatting</button></div>
      }
      @for(c of filtered(); track c._id){
        <div class="ci" [class.act]="activeChat()?._id===c._id" (click)="pickChat(c)">
          <div class="ci-av" [style.background]="chatSvc.avatarColor(chatSvc.getChatName(c,myId()))">
            {{chatSvc.initials(chatSvc.getChatName(c,myId()))}}
            <span class="ci-dot" [class.on]="isOnline(c)"></span>
          </div>
          <div class="ci-body">
            <div class="ci-top">
              <span class="ci-name">{{chatSvc.getChatName(c,myId())}}</span>
              <span class="ci-time">{{fmtTime(c.lastMessage?.createdAt)}}</span>
            </div>
            <div class="ci-bot">
              <span class="ci-prev" [class.unread]="c.unreadCount>0">
                @if(typingIn(c._id)){<em class="typing-txt">typing...</em>}
                @else{{{preview(c)}}}
              </span>
              @if(c.unreadCount>0){ <span class="unread-badge">{{c.unreadCount>99?'99+':c.unreadCount}}</span> }
            </div>
          </div>
        </div>
      }
    </div>
  </aside>

  <!-- MAIN -->
  <main class="main" [class.open]="activeChat() || !isMobile()">
    @if(!activeChat()){
      <div class="welcome">
        <div class="wl"><div class="wl-ring"></div><div class="wl-ring r2"></div><div class="wl-core">S</div></div>
        <h2>Saylo</h2>
        <p>Send messages, make calls</p>
        <button class="start-btn" (click)="showSearch.set(true)">New Conversation</button>
      </div>
    } @else {

      <!-- HEADER -->
      <div class="chat-hdr">
        @if(isMobile()){
          <button class="back-btn" (click)="chatSvc.activeChat.set(null)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        }
        <div class="hdr-av" [style.background]="chatSvc.avatarColor(chatSvc.getChatName(activeChat()!,myId()))">{{chatSvc.initials(chatSvc.getChatName(activeChat()!,myId()))}}</div>
        <div class="hdr-info">
          <div class="hdr-name">{{chatSvc.getChatName(activeChat()!,myId())}}</div>
          <div class="hdr-sub">
            @if(typingIn(activeChat()!._id)){<span class="typing-ind"><span></span><span></span><span></span></span>&nbsp;<em style="color:#008069;font-style:normal;font-size:12px;">typing...</em>}
            @else{<span class="st-dot" [class.on]="isOnline(activeChat()!)"></span>{{isOnline(activeChat()!) ? 'Online' : 'Offline'}}}
          </div>
        </div>
        <div class="hdr-acts">
          <button class="hact audio" (click)="audioCall()" title="Voice call">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          </button>
          <button class="hact video" (click)="videoCall()" title="Video call">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          </button>
        </div>
      </div>

      <!-- MESSAGES -->
      <div class="msgs" #msgsEl (click)="showEmoji.set(false)">
        @if(loadingMsgs()){ <div class="msgs-spin"><div class="spin"></div></div> }
        @for(m of messages(); track m._id){
          <div class="mr" [class.out]="isOut(m)">
            @if(!isOut(m)){
              <div class="m-av" [style.background]="chatSvc.avatarColor(m.sender.name)">{{chatSvc.initials(m.sender.name)}}</div>
            }
            <div class="bub" [class.out]="isOut(m)" [class.inc]="!isOut(m)">
              <span [class.del]="m.isDeleted">{{m.isDeleted ? '🚫 This message was deleted' : m.content}}</span>
              <div class="bub-ft">
                <span class="bub-t">{{fmtMsgTime(m.createdAt)}}</span>
                @if(isOut(m)){<span class="ticks" [class.read]="isRead(m)">{{isRead(m)?"✓✓":"✓"}}</span>}
              </div>
            </div>
          </div>
        }
        @if(typingIn(activeChat()!._id)){
          <div class="mr"><div class="typing-bub"><span></span><span></span><span></span></div></div>
        }
        <div #anchor></div>
      </div>

      <!-- EMOJI PICKER -->
      @if(showEmoji()){
        <div class="ep" (click)="$event.stopPropagation()">
          <div class="ep-top">
            <input class="ep-q" placeholder="🔍 Search emoji" [(ngModel)]="emojiQ" (ngModelChange)="filterEmoji()">
          </div>
          @if(!emojiQ){
            <div class="ep-cats">
              @for(c of CATS; track c.l){
                <button class="ep-cat" [class.act]="activeCat()===c.l" (click)="setCat(c)">{{c.i}}</button>
              }
            </div>
          }
          <div class="ep-grid">
            @for(e of emojiList(); track e){
              <button class="ep-e" (click)="insertEmoji(e)">{{e}}</button>
            }
          </div>
        </div>
      }

      <!-- INPUT -->
      <div class="inp-row">
        <button class="emoji-tog" [class.act]="showEmoji()" (click)="toggleEmoji($event)">😊</button>
        <div class="inp-box" [class.focus]="focused()">
          <input #inputEl class="inp" [(ngModel)]="txt" [placeholder]="'Message'" (ngModelChange)="onType()" (keydown.enter)="send()" (focus)="focused.set(true)" (blur)="focused.set(false);stopTyping()">
        </div>
        <button class="send-btn" [class.ready]="txt.trim()" (click)="send()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    }
  </main>
</div>
  `,
  styles: [`
    :host{display:block;height:100vh;height:100dvh;overflow:hidden;font-family:'Plus Jakarta Sans',sans-serif;}
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}

    .app{display:grid;grid-template-columns:340px 1fr;width:100vw;height:100vh;height:100dvh;background:#f0f2f5;overflow:hidden;position:fixed;inset:0;}

    /* SIDEBAR */
    .sb{display:flex;flex-direction:column;background:#fff;border-right:1px solid #e9edef;overflow:hidden;height:100%;position:relative;}
    .sb-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#fff;border-bottom:1px solid #f0f2f5;flex-shrink:0;}
    .logo{display:flex;align-items:center;gap:8px;font-size:22px;font-weight:900;color:#111b21;letter-spacing:-1px;}
    .logo-dot{width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);box-shadow:0 0 8px rgba(37,211,102,.5);}
    .sb-hdr-acts{display:flex;align-items:center;gap:10px;}
    .hbtn{width:36px;height:36px;border-radius:50%;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#54656f;transition:background .15s;min-height:unset;min-width:unset;}
    .hbtn:hover{background:#f0f2f5;}
    .my-av{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;cursor:pointer;flex-shrink:0;}
    .sb-me{display:flex;align-items:center;gap:10px;padding:10px 16px;background:#f8f9fa;border-bottom:1px solid #e9edef;flex-shrink:0;}
    .me-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0;}
    .me-info{flex:1;}
    .me-name{font-size:13.5px;font-weight:700;color:#111b21;}
    .me-st{font-size:11px;color:#667781;display:flex;align-items:center;gap:4px;}
    .online-dot{width:7px;height:7px;border-radius:50%;background:#25D366;display:inline-block;}
    .sb-search{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f0f2f5;margin:8px 12px;border-radius:10px;flex-shrink:0;}
    .sb-search input{flex:1;background:none;border:none;outline:none;font-size:14px;color:#111b21;font-family:inherit;}
    .sb-search input::placeholder{color:#8696a0;}
    .sb-search svg{color:#8696a0;flex-shrink:0;}

    /* New chat panel */
    .new-chat-panel{position:absolute;inset:0;background:#fff;z-index:50;display:flex;flex-direction:column;}
    .ncp-hdr{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#008069;color:#fff;font-size:16px;font-weight:700;flex-shrink:0;}
    .back-btn{width:36px;height:36px;border-radius:50%;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:inherit;transition:background .15s;min-height:unset;min-width:unset;}
    .back-btn:hover{background:rgba(255,255,255,.15);}
    .ncp-search{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f0f2f5;margin:8px 12px;border-radius:10px;flex-shrink:0;}
    .ncp-search input{flex:1;background:none;border:none;outline:none;font-size:14px;color:#111b21;font-family:inherit;}
    .ncp-load{display:flex;justify-content:center;padding:20px;}
    .ncp-user{display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;border-bottom:1px solid #f0f2f5;transition:background .1s;}
    .ncp-user:hover,.ncp-user:active{background:#f5f6f6;}
    .u-av{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;flex-shrink:0;}
    .u-name{font-size:15px;font-weight:600;color:#111b21;}
    .u-email{font-size:12px;color:#667781;margin-top:2px;}
    .ncp-empty,.ncp-hint{padding:24px 16px;text-align:center;color:#8696a0;font-size:13.5px;}

    /* Chat list */
    .chat-list{flex:1;overflow-y:auto;overscroll-behavior:contain;}
    .chat-list::-webkit-scrollbar{width:4px;}
    .chat-list::-webkit-scrollbar-thumb{background:#d1d7db;border-radius:2px;}
    .ske{display:flex;align-items:center;gap:12px;padding:12px 16px;}
    .ske-av{width:48px;height:48px;border-radius:50%;background:#f0f2f5;flex-shrink:0;animation:sk 1.4s ease infinite;}
    .ske-body{flex:1;}
    .ske-l{height:12px;background:#f0f2f5;border-radius:6px;width:60%;margin-bottom:6px;animation:sk 1.4s ease infinite;}
    .ske-s{height:11px;background:#f0f2f5;border-radius:6px;width:80%;animation:sk 1.4s ease infinite;}
    @keyframes sk{0%,100%{opacity:.6}50%{opacity:1}}
    .no-chats{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;gap:10px;color:#8696a0;text-align:center;}
    .nc-ico{font-size:40px;}
    .no-chats p{margin:0;font-size:14px;}
    .start-btn{padding:10px 24px;background:#008069;color:#fff;border:none;border-radius:24px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;min-height:unset;}
    .start-btn:hover{background:#006b57;}
    .ci{display:flex;align-items:center;gap:12px;padding:10px 16px;cursor:pointer;border-bottom:1px solid #f0f2f5;transition:background .1s;position:relative;}
    .ci:hover,.ci:active{background:#f5f6f6;}
    .ci.act{background:#f0f2f5;}
    .ci-av{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;flex-shrink:0;position:relative;}
    .ci-dot{position:absolute;bottom:1px;right:1px;width:12px;height:12px;border-radius:50%;background:#d1d7db;border:2px solid #fff;}
    .ci-dot.on{background:#25D366;}
    .ci-body{flex:1;min-width:0;}
    .ci-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;}
    .ci-name{font-size:15px;font-weight:600;color:#111b21;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .ci-time{font-size:11.5px;color:#667781;flex-shrink:0;margin-left:6px;}
    .ci-bot{display:flex;align-items:center;justify-content:space-between;gap:4px;}
    .ci-prev{font-size:13px;color:#667781;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}
    .ci-prev.unread{color:#111b21;font-weight:500;}
    .typing-txt{color:#008069;font-style:normal;}
    .unread-badge{min-width:20px;height:20px;padding:0 5px;background:#25D366;border-radius:10px;font-size:11px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

    /* MAIN */
    .main{display:flex;flex-direction:column;height:100%;overflow:hidden;background:#efeae2;position:relative;}
    .main::before{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c9b8' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");z-index:0;pointer-events:none;}

    .welcome{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:20px;}
    .wl{position:relative;width:90px;height:90px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;}
    .wl-ring{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(0,128,105,.2);animation:wring 3s ease-in-out infinite;}
    .wl-ring.r2{inset:-12px;animation-delay:.5s;border-color:rgba(0,128,105,.1);}
    .wl-core{width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#008069,#25D366);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#fff;box-shadow:0 8px 24px rgba(0,128,105,.3);}
    @keyframes wring{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.08);opacity:1}}
    .welcome h2{font-size:24px;font-weight:800;color:#111b21;margin:0;}
    .welcome p{color:#667781;font-size:14px;margin:0;}

    /* CHAT HEADER */
    .chat-hdr{display:flex;align-items:center;gap:10px;padding:10px 16px;background:#fff;border-bottom:1px solid #e9edef;flex-shrink:0;z-index:2;position:relative;min-height:60px;}
    .hdr-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;}
    .hdr-info{flex:1;min-width:0;}
    .hdr-name{font-size:15.5px;font-weight:700;color:#111b21;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .hdr-sub{font-size:12px;color:#667781;display:flex;align-items:center;gap:4px;margin-top:1px;}
    .st-dot{width:7px;height:7px;border-radius:50%;background:#d1d7db;flex-shrink:0;}
    .st-dot.on{background:#25D366;}
    .typing-ind{display:flex;gap:2px;align-items:center;}
    .typing-ind span{width:4px;height:4px;border-radius:50%;background:#008069;animation:ti 1.2s ease infinite;}
    .typing-ind span:nth-child(2){animation-delay:.2s;}
    .typing-ind span:nth-child(3){animation-delay:.4s;}
    @keyframes ti{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
    .hdr-acts{display:flex;gap:4px;}
    .hact{width:40px;height:40px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;min-height:unset;min-width:unset;color:#54656f;background:none;}
    .hact:hover{background:#f0f2f5;color:#111b21;}
    .hact.audio:hover{color:#25D366;}
    .hact.video:hover{color:#0080ff;}

    /* MESSAGES */
    .msgs{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:3px;overscroll-behavior:contain;position:relative;z-index:1;}
    .msgs::-webkit-scrollbar{width:4px;}
    .msgs::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:2px;}
    .msgs-spin{display:flex;justify-content:center;padding:30px;position:relative;z-index:1;}
    .mr{display:flex;align-items:flex-end;gap:6px;animation:mfade .18s ease forwards;}
    .mr.out{flex-direction:row-reverse;}
    @keyframes mfade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .m-av{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#fff;flex-shrink:0;margin-bottom:2px;}
    .bub{max-width:70%;padding:8px 12px 6px;border-radius:10px;word-break:break-word;position:relative;box-shadow:0 1px 2px rgba(0,0,0,.1);}
    .bub.inc{background:#fff;border-top-left-radius:2px;color:#111b21;}
    .bub.out{background:#d9fdd3;border-top-right-radius:2px;color:#111b21;}
    .bub .del{color:#8696a0;font-style:italic;font-size:13px;}
    .bub-ft{display:flex;align-items:center;justify-content:flex-end;gap:3px;margin-top:2px;}
    .bub-t{font-size:11px;color:#8696a0;}
    .ticks{font-size:12px;color:#8696a0;font-weight:600;}
    .ticks.read{color:#53bdeb;}
    .typing-bub{display:flex;align-items:center;gap:4px;padding:10px 14px;background:#fff;border-radius:10px;border-top-left-radius:2px;box-shadow:0 1px 2px rgba(0,0,0,.1);}
    .typing-bub span{width:7px;height:7px;border-radius:50%;background:#8696a0;animation:tb 1.2s ease infinite;}
    .typing-bub span:nth-child(2){animation-delay:.2s;}
    .typing-bub span:nth-child(3){animation-delay:.4s;}
    @keyframes tb{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}

    /* EMOJI PICKER */
    .ep{position:absolute;bottom:68px;left:8px;width:min(320px, calc(100vw - 16px));background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden;z-index:100;border:1px solid #e9edef;}
    .ep-top{padding:8px 10px;}
    .ep-q{width:100%;padding:8px 12px;background:#f0f2f5;border:none;border-radius:8px;font-size:13.5px;color:#111b21;outline:none;font-family:inherit;box-sizing:border-box;}
    .ep-cats{display:flex;gap:2px;padding:4px 8px;border-bottom:1px solid #f0f2f5;overflow-x:auto;}
    .ep-cats::-webkit-scrollbar{display:none;}
    .ep-cat{background:none;border:none;cursor:pointer;padding:5px 7px;border-radius:8px;font-size:18px;min-height:unset;min-width:unset;transition:background .1s;}
    .ep-cat.act,.ep-cat:hover{background:#f0f2f5;}
    .ep-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:1px;padding:6px;max-height:180px;overflow-y:auto;}
    .ep-e{background:none;border:none;cursor:pointer;font-size:22px;padding:4px;border-radius:8px;line-height:1;min-height:unset;min-width:unset;transition:background .1s;}
    .ep-e:hover,.ep-e:active{background:#f0f2f5;}

    /* INPUT */
    .inp-row{display:flex;align-items:center;gap:6px;padding:8px 10px;padding-bottom:calc(8px + env(safe-area-inset-bottom,0px));background:#f0f2f5;flex-shrink:0;position:relative;z-index:2;}
    .emoji-tog{width:40px;height:40px;border-radius:50%;background:none;border:none;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;min-height:unset;min-width:unset;flex-shrink:0;filter:grayscale(.3);}
    .emoji-tog:hover,.emoji-tog.act{background:#d1d7db;filter:none;}
    .inp-box{flex:1;background:#fff;border-radius:22px;padding:9px 16px;display:flex;align-items:center;transition:box-shadow .15s;box-shadow:0 1px 2px rgba(0,0,0,.08);}
    .inp-box.focus{box-shadow:0 2px 6px rgba(0,0,0,.12);}
    .inp{flex:1;background:none;border:none;outline:none;font-size:15px;color:#111b21;font-family:inherit;line-height:1.4;}
    .inp::placeholder{color:#8696a0;}
    .send-btn{width:42px;height:42px;border-radius:50%;background:#d1d7db;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#54656f;transition:all .2s;flex-shrink:0;min-height:unset;min-width:unset;}
    .send-btn.ready{background:#008069;color:#fff;box-shadow:0 3px 12px rgba(0,128,105,.35);}
    .send-btn:active{transform:scale(.93);}

    /* Incoming call toast */
    .ring-toast{position:fixed;top:env(safe-area-inset-top,0);top:max(env(safe-area-inset-top,0px),12px);right:12px;z-index:9998;background:#fff;border-radius:18px;padding:12px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,.2),0 0 0 1px rgba(0,0,0,.06);animation:toast .3s cubic-bezier(.34,1.56,.64,1);min-width:260px;max-width:320px;cursor:pointer;}
    @keyframes toast{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
    .rt-av{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0;}
    .rt-info{flex:1;min-width:0;}
    .rt-name{font-size:14.5px;font-weight:700;color:#111b21;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .rt-sub{font-size:12px;color:#667781;margin-top:2px;}
    .rt-dec{width:36px;height:36px;border-radius:50%;background:#FF3B30;border:none;cursor:pointer;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;transition:background .15s;min-height:unset;min-width:unset;flex-shrink:0;}
    .rt-ans{width:36px;height:36px;border-radius:50%;background:#25D366;border:none;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:background .15s;min-height:unset;min-width:unset;flex-shrink:0;}

    .spin{width:22px;height:22px;border:2.5px solid rgba(0,0,0,.1);border-top-color:#008069;border-radius:50%;animation:sp .7s linear infinite;}
    @keyframes sp{to{transform:rotate(360deg)}}

    /* MOBILE */
    @media(max-width:768px){
      .app{grid-template-columns:1fr;position:fixed;inset:0;}
      .sb{position:absolute;inset:0;z-index:5;}
      .sb:not(.open){display:none;}
      .main{position:absolute;inset:0;z-index:4;}
      .main:not(.open){display:none;}
      .bub{max-width:80%;}
      .msgs{padding:8px 10px;}
      .inp-row{padding:6px 8px;padding-bottom:calc(6px + env(safe-area-inset-bottom,0px));}
      .ep{left:0;right:0;width:100%;bottom:62px;border-radius:16px 16px 0 0;}
      .lv{width:80px;height:110px;}
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('msgsEl') msgsEl!: ElementRef
  @ViewChild('anchor') anchor!: ElementRef
  @ViewChild('inputEl') inputEl!: ElementRef

  private auth   = inject(AuthService)
  public chatSvc = inject(ChatService)
  private socket = inject(SocketService)
  private zone   = inject(NgZone)
  private cdr    = inject(ChangeDetectorRef)

  me         = this.auth.currentUser
  activeChat = this.chatSvc.activeChat
  messages   = this.chatSvc.messages
  typing     = this.chatSvc.typingUsers

  loading      = signal(false)
  loadingMsgs  = signal(false)
  showSearch   = signal(false)
  focused      = signal(false)
  searching    = signal(false)
  showEmoji    = signal(false)
  people       = signal<any[]>([])
  activeCall   = signal<CallState | null>(null)
  incomingCall = signal<CallState | null>(null)
  activeCat    = signal('Smileys')
  emojiList    = signal<string[]>(EMOJIS.slice(0, 40))

  readonly CATS = CATS
  txt = ''; filterQ = ''; peopleQ = ''; emojiQ = ''

  private destroy$      = new Subject<void>()
  private typingTimer: any
  private receivedIds   = new Set<string>()
  private shouldScroll  = true

  myId     = computed(() => this.me()?._id || '')
  filtered = computed(() => {
    const q = this.filterQ.toLowerCase()
    return this.chatSvc.chats().filter(c =>
      !q || this.chatSvc.getChatName(c, this.myId()).toLowerCase().includes(q)
    )
  })

  ngOnInit(): void {
    const uid = this.me()?._id
    if (!uid) return
    this.socket.connect(uid)
    this.loading.set(true)
    // Load chats via HTTP first
    this.chatSvc.getChats().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loading.set(false)
        // Then sync via socket for cross-device updates
        setTimeout(() => this.socket.syncChats(), 500)
      },
      error: () => this.loading.set(false)
    })
    this.listenSocket()
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) this.scrollBottom()
  }

  ngOnDestroy(): void {
    this.destroy$.next(); this.destroy$.complete(); this.socket.disconnect()
  }

  @HostListener('document:keydown.escape') onEsc(): void { this.showEmoji.set(false) }

  isMobile(): boolean { return window.innerWidth <= 768 }

  pickChat(c: Chat): void {
    if (this.activeChat()?._id === c._id) return
    if (this.activeChat()) this.socket.leaveChat(this.activeChat()!._id)
    this.chatSvc.activeChat.set(c)
    this.chatSvc.messages.set([])
    this.shouldScroll = true
    this.loadingMsgs.set(true)
    this.chatSvc.getMessages(c._id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
          this.loadingMsgs.set(false)
          this.socket.joinChat(c._id)
          // Mark all unread messages as read
          const msgs = this.chatSvc.messages()
          msgs.filter(m => !this.isOut(m)).forEach(m => {
            this.socket.markRead(c._id, m._id)
          })
          // Clear unread count
          this.chatSvc.chats.update(list => list.map(ch =>
            ch._id === c._id ? { ...ch, unreadCount: 0 } : ch
          ))
        },
      error: () => this.loadingMsgs.set(false)
    })
  }

  listenSocket(): void {
    this.socket.on<{message:Message}>('message:new').pipe(takeUntil(this.destroy$)).subscribe(({message}) => {
      this.zone.run(() => {
        if (this.receivedIds.has(message._id)) return
        this.receivedIds.add(message._id)
        if (this.receivedIds.size > 300) {
          const first = this.receivedIds.values().next().value!
          this.receivedIds.delete(first)
        }
        if (message.chat === this.activeChat()?._id) {
          this.shouldScroll = true
          this.chatSvc.addMessage(message)
          this.chatSvc.chats.update(list => list.map(c => c._id === message.chat ? { ...c, lastMessage: message, unreadCount: 0 } : c))
          // Auto mark as read if we're viewing this chat
          if (!this.isOut(message)) {
            this.socket.markRead(message.chat, message._id)
          }
        } else {
          this.chatSvc.chats.update(list => list.map(c => c._id === message.chat ? { ...c, lastMessage: message, unreadCount: (c.unreadCount||0)+1 } : c))
        }
      })
    })

    this.socket.on<any>('typing:start').pipe(takeUntil(this.destroy$)).subscribe(({chatId,userId}) => {
      if (userId !== this.myId()) this.chatSvc.setTyping(chatId, userId, true)
    })
    this.socket.on<any>('typing:stop').pipe(takeUntil(this.destroy$)).subscribe(({chatId,userId}) => {
      this.chatSvc.setTyping(chatId, userId, false)
    })
    this.socket.on<any>('message:read').pipe(takeUntil(this.destroy$)).subscribe(({chatId, messageId, readBy}) => {
      this.zone.run(() => {
        if (readBy !== this.myId()) {
          this.chatSvc.messages.update(ms => ms.map(m =>
            m._id === messageId ? { ...m, readBy: [...m.readBy, { user: readBy }] } : m
          ))
        }
      })
    })

    this.socket.on<any>('user:online').pipe(takeUntil(this.destroy$)).subscribe(({userId}) => {
      this.zone.run(() => this.updateStatus(userId, 'online'))
    })
    this.socket.on<any>('user:offline').pipe(takeUntil(this.destroy$)).subscribe(({userId}) => {
      this.zone.run(() => this.updateStatus(userId, 'offline'))
    })
    this.socket.on<any>('users:online').pipe(takeUntil(this.destroy$)).subscribe(({userIds}) => {
      this.zone.run(() => {
        this.chatSvc.chats.update(list => list.map(c => ({
          ...c, members: c.members.map(m => ({
            ...m, user: { ...m.user, status: userIds.includes(m.user._id) ? 'online' : 'offline' }
          }))
        })))
      })
    })

    // Sync chats across devices
    this.socket.on<any>('chats:synced').pipe(takeUntil(this.destroy$)).subscribe(({chats}) => {
      this.zone.run(() => {
        if (chats && chats.length > 0) {
          // Merge with existing chats
          this.chatSvc.chats.update(existing => {
            const merged = [...existing]
            chats.forEach((c: any) => {
              if (!merged.find(e => e._id === c._id)) merged.push(c)
            })
            return merged.sort((a, b) => new Date(b.lastActivity||0).getTime() - new Date(a.lastActivity||0).getTime())
          })
        }
      })
    })

    this.socket.on<any>('call:incoming').pipe(takeUntil(this.destroy$)).subscribe(({callId, caller, type}) => {
      this.zone.run(() => {
        const u = this.findUser(caller.userId)
        this.incomingCall.set({
          callId, type, direction: 'incoming', status: 'ringing',
          targetUserId: caller.userId,
          targetName: u?.name || 'Unknown',
          targetColor: this.chatSvc.avatarColor(u?.name || 'U'),
          targetInitials: this.chatSvc.initials(u?.name || 'U'),
        })
      })
    })
  }

  private findUser(uid: string): any {
    for (const c of this.chatSvc.chats()) {
      const m = c.members.find(m => m.user._id === uid)
      if (m) return m.user
    }
    return null
  }

  private updateStatus(uid: string, status: string): void {
    this.chatSvc.chats.update(list => list.map(c => ({
      ...c, members: c.members.map(m => m.user._id === uid ? { ...m, user: { ...m.user, status } } : m)
    })))
  }

  answerIncoming(): void {
    const call = this.incomingCall()
    if (!call) return
    this.activeCall.set({ ...call, status: 'connected' })
    this.incomingCall.set(null)
  }

  declineIncoming(): void {
    const call = this.incomingCall()
    if (call) this.socket.emit('call:decline', { callId: call.callId, targetUserId: call.targetUserId })
    this.incomingCall.set(null)
  }

  onCallEnded(): void {
    this.activeCall.set(null)
    this.cdr.detectChanges()
  }

  audioCall(): void {
    const other = this.chatSvc.getOtherUser(this.activeChat()!, this.myId())
    if (!other) return
    this.socket.initiateCall(this.activeChat()!._id, other._id, 'audio')
    this.activeCall.set({ callId:'call_'+Date.now(), type:'audio', direction:'outgoing', status:'ringing', targetUserId:other._id, targetName:other.name, targetColor:this.chatSvc.avatarColor(other.name), targetInitials:this.chatSvc.initials(other.name) })
  }

  videoCall(): void {
    const other = this.chatSvc.getOtherUser(this.activeChat()!, this.myId())
    if (!other) return
    this.socket.initiateCall(this.activeChat()!._id, other._id, 'video')
    this.activeCall.set({ callId:'call_'+Date.now(), type:'video', direction:'outgoing', status:'ringing', targetUserId:other._id, targetName:other.name, targetColor:this.chatSvc.avatarColor(other.name), targetInitials:this.chatSvc.initials(other.name) })
  }

  send(): void {
    const text = this.txt.trim()
    if (!text || !this.activeChat()) return
    this.socket.sendMessage(this.activeChat()!._id, text)
    this.txt = ''
    this.shouldScroll = true
    this.stopTyping()
  }

  onType(): void {
    if (!this.activeChat()) return
    this.socket.sendTypingStart(this.activeChat()!._id)
    clearTimeout(this.typingTimer)
    this.typingTimer = setTimeout(() => this.stopTyping(), 2000)
  }

  stopTyping(): void {
    clearTimeout(this.typingTimer)
    if (this.activeChat()) this.socket.sendTypingStop(this.activeChat()!._id)
  }

  toggleEmoji(e: Event): void { e.stopPropagation(); this.showEmoji.update(v => !v); if (this.showEmoji()) this.filterEmoji() }
  insertEmoji(emoji: string): void { this.txt += emoji; this.inputEl?.nativeElement?.focus() }
  setCat(c: any): void { this.activeCat.set(c.l); this.filterEmoji() }
  filterEmoji(): void {
    if (this.emojiQ) { this.emojiList.set(EMOJIS.filter(e => e.includes(this.emojiQ)).slice(0, 64)); return }
    const cat = CATS.find(c => c.l === this.activeCat())
    this.emojiList.set(cat ? EMOJIS.slice(cat.s, cat.e) : EMOJIS.slice(0, 40))
  }

  findPeople(q: string): void {
    if (!q.trim()) { this.people.set([]); return }
    this.searching.set(true)
    this.chatSvc.searchUsers(q).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r: any) => { this.people.set(r.data?.users || []); this.searching.set(false) },
      error: () => this.searching.set(false)
    })
  }

  startChat(uid: string): void {
    this.chatSvc.createDirectChat(uid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r: any) => {
        this.showSearch.set(false); this.people.set([]); this.peopleQ = ''
        const chat = r.data?.chat
        if (chat) { const found = this.chatSvc.chats().find(c => c._id === chat._id); this.pickChat(found || chat) }
      }
    })
  }

  logout(): void { this.auth.logout() }

  scrollBottom(): void {
    try { this.anchor?.nativeElement?.scrollIntoView({ behavior: 'auto' }) } catch {}
  }

  isOut(m: Message): boolean { return m.sender._id === this.myId() }
  isRead(m: Message): boolean {
    if (!m.readBy || m.readBy.length === 0) return false
    return m.readBy.some((r: any) => {
      const uid = r.user?._id || r.user || r
      return uid && uid.toString() !== this.myId()
    })
  }
  typingIn(chatId: string): boolean { return (this.typing()[chatId] || []).length > 0 }
  isOnline(c: Chat): boolean { return this.chatSvc.getOtherUser(c, this.myId())?.status === 'online' }

  preview(c: Chat): string {
    if (!c.lastMessage) return 'No messages yet'
    if (c.lastMessage.isDeleted) return 'This message was deleted'
    const mine = c.lastMessage.sender._id === this.myId()
    return (mine ? 'You: ' : '') + (c.lastMessage.content?.slice(0, 45) || '')
  }

  fmtTime(d?: string): string {
    if (!d) return ''
    const dt = new Date(d), now = new Date()
    if (dt.toDateString() === now.toDateString())
      return dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    const diff = Math.floor((now.getTime() - dt.getTime()) / 86400000)
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return dt.toLocaleDateString('en-IN', { weekday: 'short' })
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  fmtMsgTime(d: string): string {
    return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  }
}
