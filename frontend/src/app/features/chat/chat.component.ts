import {
  Component, OnInit, OnDestroy, signal, computed,
  ViewChild, ElementRef, AfterViewChecked, HostListener, NgZone
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Subject, takeUntil } from 'rxjs'
import { AuthService } from '../../core/services/auth.service'
import { SocketService } from '../../core/services/socket.service'
import { ChatService, Chat, Message } from '../../core/services/chat.service'
import { CallService } from '../../core/services/call.service'
import { CallComponent } from '../call/call.component'
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe, MatSnackBarModule, CallComponent],
  template: `
<div class="shell">

  <!-- NAV RAIL -->
  <nav class="rail">
    <div class="rail-logo">S</div>

    <div class="rail-nav">
      <button class="rail-btn active" title="Chats">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
        @if(totalUnread()>0){<span class="rail-badge">{{totalUnread()>9?'9+':totalUnread()}}</span>}
      </button>
      <button class="rail-btn" title="Calls">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
      </button>
      <button class="rail-btn" title="People">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </button>
    </div>

    <div class="rail-bottom">
      <button class="rail-btn" title="Settings">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </button>
      <button class="rail-user" (click)="logout()" [title]="me()?.name||'Me'">
        <div class="rail-avatar" [style.background]="avatarColor(me()?.name||'U')">{{initials(me()?.name||'U')}}</div>
        <span class="rail-online"></span>
      </button>
    </div>
  </nav>

  <!-- SIDEBAR -->
  <aside class="sidebar" [class.hidden]="activeChat()&&mobile()">

    <div class="sb-head">
      <h1 class="sb-title">Messages</h1>
      <button class="icon-btn new-btn" (click)="showPeople.set(true)" title="New chat">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
      </button>
    </div>

    <div class="sb-search">
      <div class="search-box" [class.focus]="sf()">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
        <input placeholder="Search conversations..." [(ngModel)]="sq" (focus)="sf.set(true)" (blur)="sf.set(false)">
        @if(sq){<button class="clr" (click)="sq=''">✕</button>}
      </div>
    </div>

    <!-- People search overlay -->
    @if(showPeople()){
      <div class="people-panel animate-in">
        <div class="pp-head">
          <span>New conversation</span>
          <button class="icon-btn" (click)="showPeople.set(false);pq='';people.set([])">✕</button>
        </div>
        <div class="pp-search">
          <input class="pp-input" placeholder="Search name or email..." [(ngModel)]="pq" (ngModelChange)="findPeople($event)" autofocus>
        </div>
        @if(searching()){<div class="pp-loading"><div class="spin"></div></div>}
        @for(u of people();track u._id){
          <div class="pp-user" (click)="openChat(u._id,u.name)">
            <div class="pp-av" [style.background]="avatarColor(u.name)">{{initials(u.name)}}</div>
            <div class="pp-info">
              <span class="pp-name">{{u.name}}</span>
              <span class="pp-email">{{u.email}}</span>
            </div>
            <span class="pp-status" [class]="u.status">{{u.status}}</span>
          </div>
        }
        @if(!searching()&&pq&&people().length===0){
          <div class="pp-empty">No users found for "{{pq}}"</div>
        }
      </div>
    }

    <div class="sb-tabs">
      @for(t of tabs;track t.v){
        <button class="tab" [class.on]="tf()===t.v" (click)="tf.set(t.v)">{{t.l}}</button>
      }
    </div>

    <div class="sb-list">
      @if(loading()){
        @for(i of [1,2,3,4,5];track i){
          <div class="ske-item">
            <div class="ske-av skeleton"></div>
            <div class="ske-lines"><div class="skeleton" style="height:12px;width:55%"></div><div class="skeleton" style="height:10px;width:80%;margin-top:6px"></div></div>
          </div>
        }
      }@else if(filteredChats().length===0){
        <div class="sb-empty">
          <div style="font-size:40px;margin-bottom:12px">💬</div>
          <p>No conversations yet</p>
          <button class="start-btn" (click)="showPeople.set(true)">Start chatting</button>
        </div>
      }@else{
        @for(c of filteredChats();track c._id){
          <div class="ci" [class.on]="activeChat()?._id===c._id" (click)="pick(c)">
            <div class="ci-av" [style.background]="avatarColor(chatName(c))">
              {{initials(chatName(c))}}
              <span class="ci-dot" [class]="chatStatus(c)"></span>
            </div>
            <div class="ci-body">
              <div class="ci-row">
                <span class="ci-name">{{chatName(c)}}</span>
                <span class="ci-time">{{c.lastMessage?.createdAt|timeAgo}}</span>
              </div>
              <div class="ci-row">
                <span class="ci-preview" [class.bold]="hasUnread(c)">
                  @if(isTypingIn(c._id)){<em class="typing-txt">typing...</em>}
                  @else{{{preview(c)}}}
                </span>
                @if(hasUnread(c)){<span class="ci-badge">{{c.unreadCount}}</span>}
              </div>
            </div>
          </div>
        }
      }
    </div>
  </aside>

  <!-- MAIN -->
  <main class="main" [class.show]="activeChat()||!mobile()">

    @if(!activeChat()){
      <div class="welcome">
        <div class="w-logo">S</div>
        <h2 class="w-title gradient-text">Welcome to Saylo</h2>
        <p class="w-sub">Select a chat or start a new conversation</p>
        <button class="start-btn" (click)="showPeople.set(true)">New conversation</button>
      </div>
    }@else{

      <!-- HEADER -->
      <header class="mh">
        @if(mobile()){
          <button class="icon-btn" (click)="chatSvc.activeChat.set(null)">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
        }
        <div class="mh-av" [style.background]="avatarColor(chatName(activeChat()!))">
          {{initials(chatName(activeChat()!))}}
        </div>
        <div class="mh-info">
          <div class="mh-name">{{chatName(activeChat()!)}}</div>
          <div class="mh-status">
            @if(isTypingIn(activeChat()!._id)){
              <span class="mh-typing">
                <span class="td td1"></span><span class="td td2"></span><span class="td td3"></span>
                typing...
              </span>
            }@else{
              <span class="mh-dot" [class]="chatStatus(activeChat()!)"></span>
              {{chatStatusTxt(activeChat()!)}}
            }
          </div>
        </div>
        <div class="mh-acts">
          <button class="mh-btn audio" title="Audio call" (click)="callAudio()">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </button>
          <button class="mh-btn video" title="Video call" (click)="callVideo()">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </button>
          <button class="mh-btn" title="More">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01"/></svg>
          </button>
        </div>
      </header>

      <!-- MESSAGES -->
      <div class="msgs" #msgsEl (scroll)="onScroll($event)">
        @if(loadingMsgs()){<div class="msgs-load"><div class="spin"></div></div>}

        @for(g of msgGroups();track g.date){
          <div class="date-div"><span>{{g.date}}</span></div>
          @for(m of g.messages;track m._id){
            <div class="mr" [class.out]="isOut(m)" [class.seq]="m['_seq']">
              @if(!isOut(m)&&!m['_seq']){
                <div class="mr-av" [style.background]="avatarColor(m.sender.name)">{{initials(m.sender.name)}}</div>
              }@else if(!isOut(m)){
                <div class="mr-sp"></div>
              }
              <div class="mb-wrap">
                @if(!isOut(m)&&!m['_seq']){<span class="mb-who">{{m.sender.name}}</span>}
                @if(m.replyTo){
                  <div class="reply-bar" [class.out]="isOut(m)">
                    <span class="reply-who">{{m.replyTo.sender?.name}}</span>
                    <span class="reply-txt">{{m.replyTo.content|slice:0:60}}</span>
                  </div>
                }
                <div class="mb" [class.inc]="!isOut(m)" [class.out]="isOut(m)" [class.del]="m.isDeleted" (dblclick)="setReply(m)">
                  @if(m.isDeleted){
                    <span class="del-txt">🚫 Message deleted</span>
                  }@else{
                    <span class="mb-txt">{{m.content}}</span>
                  }
                  <div class="mb-foot">
                    <span class="mb-time">{{fmtTime(m.createdAt)}}</span>
                    @if(isOut(m)){
                      <span class="mb-tick" [class.seen]="isRead(m)">
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                          <path d="M1 5L5 9L15 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                          @if(isRead(m)){<path d="M6 5L10 9L15 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>}
                        </svg>
                      </span>
                    }
                  </div>
                </div>
                @if(m.reactions.length>0){
                  <div class="reacts" [class.out]="isOut(m)">
                    @for(r of groupReacts(m);track r.emoji){
                      <button class="react-chip" (click)="react(m,r.emoji)">{{r.emoji}} {{r.count}}</button>
                    }
                  </div>
                }
              </div>
            </div>
          }
        }

        @if(isTypingIn(activeChat()!._id)){
          <div class="mr animate-in">
            <div class="mr-av" style="background:var(--bg-elevated)">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="typing-bub">
              <span class="td td1"></span><span class="td td2"></span><span class="td td3"></span>
            </div>
          </div>
        }
        <div #anchor></div>
      </div>

      <!-- REPLY BAR -->
      @if(replyTo()){
        <div class="reply-strip animate-in">
          <div class="rs-line"></div>
          <div class="rs-info">
            <span class="rs-name">↩ Replying to {{replyTo()!.sender.name}}</span>
            <span class="rs-txt">{{replyTo()!.content|slice:0:80}}</span>
          </div>
          <button class="icon-btn" (click)="replyTo.set(null)">✕</button>
        </div>
      }

      <!-- INPUT -->
      <div class="inp-bar">
        <button class="inp-btn" title="Attach file" (click)="fi.click()">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
        </button>
        <input #fi type="file" style="display:none" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" (change)="onFile($event)">

        <div class="inp-wrap" [class.focus]="inpFocus()">
          <input
            #msgInp
            class="inp"
            type="text"
            [placeholder]="'Message '+chatName(activeChat()!)+'...'"
            [(ngModel)]="txt"
            (ngModelChange)="onType()"
            (keydown.enter)="send()"
            (focus)="inpFocus.set(true)"
            (blur)="inpFocus.set(false);stopType()"
          >
          <button class="emoji-btn" title="Emoji">😊</button>
        </div>

        <button class="send-btn" [class.ready]="txt.trim()" (click)="send()" title="Send">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
        </button>
      </div>
    }
  </main>

  <!-- CALL OVERLAY -->
  <app-call/>
</div>
  `,
  styles: [`
    /* ── SHELL ── */
    :host { display:flex; height:100vh; overflow:hidden; }

    .shell {
      display:grid;
      grid-template-columns:64px 300px 1fr;
      width:100vw;
      height:100vh;
      overflow:hidden;
      background:var(--bg-void);
      font-family:var(--font-body);
    }

    /* ── RAIL ── */
    .rail {
      background:#060910;
      border-right:1px solid var(--border-subtle);
      display:flex;
      flex-direction:column;
      align-items:center;
      padding:16px 0;
      gap:4px;
      z-index:20;
    }

    .rail-logo {
      width:36px;height:36px;
      background:var(--grad-cyber);
      border-radius:10px;
      display:flex;align-items:center;justify-content:center;
      font-family:var(--font-display);font-weight:800;font-size:15px;color:#fff;
      box-shadow:0 4px 16px rgba(108,99,255,.45);
      margin-bottom:16px;flex-shrink:0;
    }

    .rail-nav { display:flex;flex-direction:column;align-items:center;gap:2px;flex:1; }
    .rail-bottom { display:flex;flex-direction:column;align-items:center;gap:8px; }

    .rail-btn {
      width:40px;height:40px;border-radius:11px;
      display:flex;align-items:center;justify-content:center;
      background:none;border:none;cursor:pointer;
      color:var(--text-muted);transition:all .2s;position:relative;
    }
    .rail-btn:hover{background:var(--bg-hover);color:var(--text-secondary);}
    .rail-btn.active{background:rgba(108,99,255,.15);color:var(--accent-primary);}
    .rail-btn.active::before{
      content:'';position:absolute;left:-1px;top:50%;transform:translateY(-50%);
      width:3px;height:16px;background:var(--accent-primary);border-radius:0 2px 2px 0;
    }

    .rail-badge {
      position:absolute;top:4px;right:4px;
      min-width:15px;height:15px;padding:0 3px;
      background:var(--accent-tertiary);border-radius:8px;
      border:2px solid #060910;
      font-size:8px;font-weight:700;color:#fff;
      display:flex;align-items:center;justify-content:center;
    }

    .rail-user{background:none;border:none;cursor:pointer;position:relative;width:34px;height:34px;}
    .rail-avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:12px;color:#fff;}
    .rail-online{position:absolute;bottom:0;right:0;width:9px;height:9px;background:var(--accent-green);border-radius:50%;border:2px solid #060910;}

    /* ── SIDEBAR ── */
    .sidebar {
      background:var(--bg-surface);
      border-right:1px solid var(--border-subtle);
      display:flex;flex-direction:column;
      overflow:hidden;z-index:15;
      position:relative;
    }

    .sb-head{
      display:flex;align-items:center;justify-content:space-between;
      padding:18px 14px 10px;
    }
    .sb-title{font-family:var(--font-display);font-size:19px;font-weight:700;letter-spacing:-.3px;}

    .icon-btn{
      width:32px;height:32px;border-radius:9px;
      display:flex;align-items:center;justify-content:center;
      background:none;border:none;cursor:pointer;
      color:var(--text-muted);transition:all .15s;
    }
    .icon-btn:hover{background:var(--bg-hover);color:var(--accent-primary);}
    .new-btn{background:rgba(108,99,255,.12);color:var(--accent-primary);}

    .sb-search{padding:0 10px 8px;}
    .search-box{
      display:flex;align-items:center;gap:8px;
      background:var(--bg-elevated);
      border:1px solid var(--border-subtle);
      border-radius:12px;padding:8px 12px;
      transition:border-color .15s;
    }
    .search-box.focus{border-color:var(--border-active);}
    .search-box svg{color:var(--text-muted);flex-shrink:0;}
    .search-box input{background:none;border:none;outline:none;color:var(--text-primary);font-family:var(--font-body);font-size:13px;flex:1;}
    .search-box input::placeholder{color:var(--text-muted);}
    .clr{background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:11px;}

    /* People panel */
    .people-panel{
      position:absolute;inset:0;
      background:var(--bg-surface);z-index:30;
      display:flex;flex-direction:column;
    }
    .pp-head{
      display:flex;align-items:center;justify-content:space-between;
      padding:14px;border-bottom:1px solid var(--border-subtle);
      font-family:var(--font-display);font-weight:600;font-size:14px;
    }
    .pp-search{padding:10px 14px;}
    .pp-input{
      width:100%;padding:9px 12px;
      background:var(--bg-elevated);
      border:1px solid var(--border-subtle);
      border-radius:10px;color:var(--text-primary);
      font-family:var(--font-body);font-size:13px;outline:none;
    }
    .pp-input:focus{border-color:var(--border-focus);}
    .pp-input::placeholder{color:var(--text-muted);}
    .pp-loading{display:flex;justify-content:center;padding:20px;}
    .pp-user{
      display:flex;align-items:center;gap:10px;
      padding:11px 14px;cursor:pointer;
      border-bottom:1px solid var(--border-subtle);
      transition:background .15s;
    }
    .pp-user:hover{background:var(--bg-hover);}
    .pp-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:13px;color:#fff;flex-shrink:0;}
    .pp-info{flex:1;}
    .pp-name{display:block;font-weight:600;font-size:13.5px;}
    .pp-email{font-size:11.5px;color:var(--text-muted);}
    .pp-status{font-size:10px;font-weight:600;padding:2px 7px;border-radius:20px;}
    .pp-status.online{background:rgba(0,229,160,.1);color:var(--accent-green);}
    .pp-status.offline{background:var(--bg-elevated);color:var(--text-muted);}
    .pp-empty{padding:24px;text-align:center;font-size:13px;color:var(--text-muted);}

    .sb-tabs{display:flex;gap:4px;padding:0 10px 8px;}
    .tab{
      padding:4px 12px;border-radius:20px;font-size:11.5px;font-weight:500;
      background:none;border:1px solid transparent;cursor:pointer;
      color:var(--text-muted);transition:all .15s;
    }
    .tab:hover{color:var(--text-secondary);}
    .tab.on{background:rgba(108,99,255,.12);color:var(--accent-primary);border-color:rgba(108,99,255,.2);}

    .sb-list{flex:1;overflow-y:auto;padding:4px 6px;}
    .sb-list::-webkit-scrollbar{width:3px;}
    .sb-list::-webkit-scrollbar-thumb{background:var(--border-subtle);border-radius:2px;}

    .ske-item{display:flex;align-items:center;gap:10px;padding:10px;}
    .ske-av{width:42px;height:42px;border-radius:50%;flex-shrink:0;}
    .ske-lines{flex:1;display:flex;flex-direction:column;gap:6px;}

    .sb-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:180px;text-align:center;color:var(--text-muted);font-size:13px;gap:8px;}
    .start-btn{padding:8px 18px;background:var(--grad-brand);color:#fff;border:none;border-radius:10px;font-family:var(--font-body);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;margin-top:8px;}
    .start-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(108,99,255,.4);}

    /* Chat item */
    .ci{
      display:flex;align-items:center;gap:10px;
      padding:9px 8px;border-radius:12px;cursor:pointer;
      transition:background .12s;margin-bottom:2px;
    }
    .ci:hover{background:var(--bg-hover);}
    .ci.on{background:rgba(108,99,255,.10);border:1px solid rgba(108,99,255,.14);}

    .ci-av{
      width:42px;height:42px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-family:var(--font-display);font-weight:700;font-size:13px;color:#fff;
      flex-shrink:0;position:relative;
    }
    .ci-dot{
      position:absolute;bottom:1px;right:1px;
      width:10px;height:10px;border-radius:50%;
      border:2px solid var(--bg-surface);
    }
    .ci-dot.online{background:var(--accent-green);}
    .ci-dot.offline{background:var(--text-muted);}
    .ci-dot.busy{background:var(--accent-red);}

    .ci-body{flex:1;min-width:0;}
    .ci-row{display:flex;align-items:center;justify-content:space-between;gap:4px;margin-bottom:2px;}
    .ci-name{font-family:var(--font-display);font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .ci-time{font-size:10.5px;color:var(--text-muted);flex-shrink:0;}
    .ci-preview{font-size:12px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}
    .ci-preview.bold{color:var(--text-secondary);font-weight:500;}
    .typing-txt{color:var(--accent-primary);font-style:italic;}
    .ci-badge{min-width:17px;height:17px;padding:0 4px;background:var(--accent-primary);border-radius:9px;font-size:9.5px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

    /* ── MAIN ── */
    .main{
      display:flex;
      flex-direction:column;
      height:100vh;
      background:var(--bg-deep);
      overflow:hidden;
      z-index:10;
    }

    .welcome{
      flex:1;display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:12px;text-align:center;
    }
    .w-logo{
      width:72px;height:72px;background:var(--grad-cyber);border-radius:20px;
      display:flex;align-items:center;justify-content:center;
      font-family:var(--font-display);font-weight:800;font-size:30px;color:#fff;
      box-shadow:0 8px 32px rgba(108,99,255,.35);margin-bottom:8px;
    }
    .w-title{font-family:var(--font-display);font-size:26px;font-weight:700;}
    .w-sub{color:var(--text-muted);font-size:14px;margin-bottom:8px;}

    /* Header */
    .mh{
      display:flex;align-items:center;padding:0 18px;gap:10px;
      height:62px;flex-shrink:0;
      border-bottom:1px solid var(--border-subtle);
      background:rgba(13,17,23,.9);
      backdrop-filter:blur(20px);
    }
    .mh-av{
      width:36px;height:36px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-family:var(--font-display);font-weight:700;font-size:12px;color:#fff;flex-shrink:0;
    }
    .mh-info{flex:1;}
    .mh-name{font-family:var(--font-display);font-size:14.5px;font-weight:700;letter-spacing:-.2px;}
    .mh-status{font-size:11.5px;color:var(--text-muted);display:flex;align-items:center;gap:5px;margin-top:1px;}
    .mh-dot{width:6px;height:6px;border-radius:50%;display:inline-block;}
    .mh-dot.online{background:var(--accent-green);}
    .mh-dot.offline{background:var(--text-muted);}
    .mh-typing{color:var(--accent-primary);font-style:italic;display:flex;align-items:center;gap:4px;}
    .mh-acts{display:flex;gap:4px;}
    .mh-btn{
      width:34px;height:34px;border-radius:9px;
      display:flex;align-items:center;justify-content:center;
      background:none;border:none;cursor:pointer;
      color:var(--text-secondary);transition:all .15s;
    }
    .mh-btn:hover{background:var(--bg-hover);}
    .mh-btn.audio:hover{color:var(--accent-green);background:rgba(0,229,160,.08);}
    .mh-btn.video:hover{color:var(--accent-secondary);background:rgba(0,212,255,.08);}

    /* Messages */
    .msgs{
      flex:1;overflow-y:auto;
      padding:14px 18px;
      display:flex;flex-direction:column;
      gap:2px;
      min-height:0;
    }
    .msgs::-webkit-scrollbar{width:3px;}
    .msgs::-webkit-scrollbar-thumb{background:var(--border-subtle);border-radius:2px;}

    .msgs-load{display:flex;justify-content:center;padding:24px;}

    .date-div{
      display:flex;align-items:center;gap:10px;
      padding:10px 0;flex-shrink:0;
    }
    .date-div::before,.date-div::after{content:'';flex:1;height:1px;background:var(--border-subtle);}
    .date-div span{
      font-size:10.5px;color:var(--text-muted);font-weight:500;
      padding:3px 10px;background:var(--bg-elevated);
      border-radius:20px;border:1px solid var(--border-subtle);white-space:nowrap;
    }

    .mr{
      display:flex;align-items:flex-end;gap:7px;
      animation:fadeUp .2s ease forwards;
    }
    .mr.out{flex-direction:row-reverse;}
    .mr.seq{margin-top:-3px;}

    .mr-av{
      width:26px;height:26px;border-radius:50%;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      font-family:var(--font-display);font-weight:700;font-size:9px;color:#fff;
      margin-bottom:2px;
    }
    .mr-sp{width:26px;flex-shrink:0;}

    .mb-wrap{
      max-width:66%;display:flex;flex-direction:column;gap:2px;
    }
    .mr.out .mb-wrap{align-items:flex-end;}

    .mb-who{font-size:10.5px;color:var(--text-muted);font-weight:600;padding:0 10px;}

    .reply-bar{
      padding:5px 9px;
      background:var(--bg-elevated);
      border-left:3px solid var(--accent-primary);
      border-radius:7px;margin-bottom:2px;
    }
    .reply-bar.out{border-left-color:rgba(255,255,255,.35);}
    .reply-who{display:block;font-size:10.5px;font-weight:600;color:var(--accent-primary);}
    .reply-txt{font-size:11.5px;color:var(--text-muted);}

    .mb{
      padding:9px 13px;border-radius:16px;
      word-break:break-word;position:relative;
    }
    .mb.inc{
      background:var(--bg-elevated);
      border:1px solid var(--border-subtle);
      border-bottom-left-radius:3px;
      color:var(--text-primary);
    }
    .mb.out{
      background:linear-gradient(135deg,var(--accent-primary),#8B5CF6);
      border-bottom-right-radius:3px;
      color:#fff;
    }
    .mb.del{opacity:.5;background:var(--bg-elevated)!important;}

    .mb-txt{font-size:13.5px;line-height:1.5;}
    .del-txt{font-size:12.5px;font-style:italic;color:var(--text-muted);}

    .mb-foot{
      display:flex;align-items:center;justify-content:flex-end;
      gap:3px;margin-top:3px;
    }
    .mb-time{font-size:10px;opacity:.6;}
    .mb.out .mb-time{color:rgba(255,255,255,.75);}
    .mb-tick{display:flex;align-items:center;color:rgba(255,255,255,.6);}
    .mb-tick.seen{color:#67e8d8;}

    .reacts{display:flex;gap:3px;flex-wrap:wrap;}
    .reacts.out{justify-content:flex-end;}
    .react-chip{
      background:var(--bg-elevated);border:1px solid var(--border-subtle);
      border-radius:20px;padding:2px 7px;font-size:11.5px;cursor:pointer;
      transition:all .12s;
    }
    .react-chip:hover{border-color:var(--border-active);}

    /* Typing bubble */
    .typing-bub{
      display:flex;align-items:center;gap:4px;
      padding:11px 14px;
      background:var(--bg-elevated);
      border:1px solid var(--border-subtle);
      border-radius:16px;border-bottom-left-radius:3px;
    }

    /* Typing dots */
    .td{
      width:5px;height:5px;border-radius:50%;
      background:var(--accent-primary);
      display:inline-block;
      animation:tdBounce 1.2s ease-in-out infinite;
    }
    .td1{animation-delay:0s;}
    .td2{animation-delay:.2s;}
    .td3{animation-delay:.4s;}

    /* Reply strip */
    .reply-strip{
      display:flex;align-items:center;gap:10px;
      padding:7px 14px;
      background:var(--bg-elevated);
      border-top:1px solid var(--border-subtle);
      flex-shrink:0;
    }
    .rs-line{width:3px;height:30px;background:var(--accent-primary);border-radius:2px;flex-shrink:0;}
    .rs-info{flex:1;}
    .rs-name{display:block;font-size:11px;font-weight:600;color:var(--accent-primary);}
    .rs-txt{font-size:11.5px;color:var(--text-muted);}

    /* Input */
    .inp-bar{
      display:flex;align-items:center;gap:8px;
      padding:12px 16px;
      border-top:1px solid var(--border-subtle);
      background:rgba(13,17,23,.95);
      backdrop-filter:blur(20px);
      flex-shrink:0;
    }
    .inp-btn{
      width:36px;height:36px;border-radius:9px;
      display:flex;align-items:center;justify-content:center;
      background:none;border:none;cursor:pointer;
      color:var(--text-muted);transition:all .15s;flex-shrink:0;
    }
    .inp-btn:hover{background:var(--bg-hover);color:var(--accent-primary);}

    .inp-wrap{
      flex:1;display:flex;align-items:center;gap:6px;
      background:var(--bg-elevated);
      border:1px solid var(--border-subtle);
      border-radius:22px;padding:9px 14px;
      transition:border-color .15s;
    }
    .inp-wrap.focus{border-color:var(--border-active);}

    .inp{
      flex:1;background:none;border:none;outline:none;
      color:var(--text-primary);font-family:var(--font-body);font-size:13.5px;
    }
    .inp::placeholder{color:var(--text-muted);}

    .emoji-btn{background:none;border:none;cursor:pointer;font-size:17px;display:flex;transition:transform .15s;}
    .emoji-btn:hover{transform:scale(1.2);}

    .send-btn{
      width:40px;height:40px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      background:var(--bg-elevated);
      border:1px solid var(--border-subtle);
      cursor:pointer;color:var(--text-muted);
      transition:all .2s cubic-bezier(.34,1.56,.64,1);
      flex-shrink:0;
    }
    .send-btn.ready{
      background:linear-gradient(135deg,var(--accent-primary),#8B5CF6);
      border-color:transparent;color:#fff;
      box-shadow:0 4px 16px rgba(108,99,255,.4);
    }
    .send-btn.ready:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(108,99,255,.5);}

    /* Spinner */
    .spin{
      width:20px;height:20px;
      border:2px solid var(--border-subtle);
      border-top-color:var(--accent-primary);
      border-radius:50%;
      animation:spinA .7s linear infinite;
    }

    /* Animations */
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
    @keyframes tdBounce{0%,80%,100%{transform:translateY(0);opacity:.4;}40%{transform:translateY(-6px);opacity:1;}}
    @keyframes spinA{to{transform:rotate(360deg);}}
    .animate-in{animation:fadeUp .25s ease forwards;}

    /* Responsive */
    @media(max-width:768px){
      .shell{grid-template-columns:0 100% 0;}
      .rail{display:none;}
      .sidebar{width:100%;grid-column:2;}
      .sidebar.hidden{display:none;}
      .main{grid-column:2;}
      .main:not(.show){display:none;}
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('msgsEl') msgsEl!: ElementRef<HTMLDivElement>
  @ViewChild('anchor') anchor!: ElementRef
  @ViewChild('msgInp') msgInp!: ElementRef<HTMLInputElement>

  private destroy$ = new Subject<void>()
  private typingTimer: any = null
  private doScroll = true

  me         = this.auth.currentUser
  activeChat = this.chatSvc.activeChat
  messages   = this.chatSvc.messages
  chats      = this.chatSvc.chats
  typing     = this.chatSvc.typingUsers

  loading     = signal(false)
  loadingMsgs = signal(false)
  showPeople  = signal(false)
  sf          = signal(false)   // search focused
  inpFocus    = signal(false)
  searching   = signal(false)
  tf          = signal('all')   // tab filter
  replyTo     = signal<Message|null>(null)
  people      = signal<any[]>([])

  sq = ''   // sidebar search query
  pq = ''   // people search query
  txt = ''  // message text

  tabs = [{l:'All',v:'all'},{l:'Unread',v:'unread'},{l:'Groups',v:'groups'}]

  filteredChats = computed(() => {
    let list = this.chats()
    if (this.sq) list = list.filter(c => this.chatName(c).toLowerCase().includes(this.sq.toLowerCase()))
    if (this.tf() === 'unread') list = list.filter(c => this.hasUnread(c))
    if (this.tf() === 'groups') list = list.filter(c => c.type === 'group')
    return list
  })

  totalUnread = computed(() => this.chats().reduce((s, c) => s + (c.unreadCount || 0), 0))

  msgGroups = computed(() => {
    const msgs = this.messages()
    if (!msgs.length) return []
    const groups: {date:string; messages:any[]}[] = []
    let curDate = '', curMsgs: any[] = []

    msgs.forEach((m, i) => {
      const d = this.fmtDate(m.createdAt)
      const prev = msgs[i-1]
      const seq = prev &&
        prev.sender._id === m.sender._id &&
        this.fmtDate(prev.createdAt) === d &&
        (new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime()) < 120000
      const em = {...m, _seq: seq}
      if (d !== curDate) {
        if (curMsgs.length) groups.push({date: curDate, messages: curMsgs})
        curDate = d; curMsgs = [em]
      } else curMsgs.push(em)
    })
    if (curMsgs.length) groups.push({date: curDate, messages: curMsgs})
    return groups
  })

  constructor(
    private auth: AuthService,
    private socket: SocketService,
    public chatSvc: ChatService,
    public callSvc: CallService,
    private snack: MatSnackBar,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.socket.connect()
    setTimeout(() => this.loadChats(), 400)
    this.listenSocket()
  }

  ngAfterViewChecked(): void {
    if (this.doScroll) this.scrollBottom()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.socket.disconnect()
  }

  @HostListener('window:resize') onResize() {}
  mobile(): boolean { return window.innerWidth <= 768 }

  loadChats(): void {
    this.loading.set(true)
    this.chatSvc.getMyChats().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    })
  }
// Call type indicator in message preview
getCallIcon(chat: Chat): string {
  const last = chat.lastMessage
  if (!last) return ''
  if (last.content?.includes('audio')) return '📞'
  if (last.content?.includes('video')) return '📹'
  return ''
}
  pick(chat: Chat): void {
    if (this.activeChat()?._id === chat._id) return
    if (this.activeChat()) this.socket.leaveChat(this.activeChat()!._id)
    this.chatSvc.activeChat.set(chat)
    this.chatSvc.messages.set([])
    this.replyTo.set(null)
    this.doScroll = true
    this.loadingMsgs.set(true)
    this.chatSvc.getMessages(chat._id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loadingMsgs.set(false)
        this.socket.joinChat(chat._id)
        this.doScroll = true
      },
      
      error: () => this.loadingMsgs.set(false),
    })
    // Mark all messages as read when opening chat
setTimeout(() => {
  const unreadIds = this.messages()
    .filter(m => !this.isOut(m) && !m.readBy.some((r:any) => r.user === this.me()?._id))
    .map(m => m._id)
    .filter(id => !id.startsWith('tmp_'))

  if (unreadIds.length > 0) {
    this.socket.markRead(chat._id, unreadIds)
    // Clear unread count
    this.chatSvc.chats.update(list =>
      list.map(c => c._id === chat._id ? {...c, unreadCount: 0} : c)
    )
  }
}, 500)
  }

  listenSocket(): void {
    // New message
    this.socket.on<{message: Message}>('message:new')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({message}) => {
        this.zone.run(() => {
          if (message.chat === this.activeChat()?._id) {
            // Remove optimistic duplicate
            if (message.sender._id === this.me()?._id) {
              this.chatSvc.messages.update(ms => ms.filter(m => !m._id.startsWith('tmp_')))
            }
            this.chatSvc.addMessage(message)
            this.doScroll = true
          } else {
            this.chatSvc.chats.update(list =>
              list.map(c => c._id === message.chat
                ? {...c, lastMessage: message, unreadCount: (c.unreadCount||0)+1}
                : c
              )
            )
          }
        })
      })

    // Typing
    this.socket.on<{userId:string;chatId:string}>('typing:start')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({userId, chatId}) => {
        if (userId !== this.me()?._id) this.chatSvc.setTyping(chatId, userId, true)
      })

    this.socket.on<{userId:string;chatId:string}>('typing:stop')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({userId, chatId}) => this.chatSvc.setTyping(chatId, userId, false))

    // Online/offline
    this.socket.on<{userId:string}>('user:online')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({userId}) => {
        this.zone.run(() => {
          this.chatSvc.chats.update(list =>
            list.map(c => ({...c, members: c.members.map(m =>
              m.user._id === userId ? {...m, user:{...m.user, status:'online'}} : m
            )}))
          )
        })
      })

    this.socket.on<{userId:string}>('user:offline')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({userId}) => {
        this.zone.run(() => {
          this.chatSvc.chats.update(list =>
            list.map(c => ({...c, members: c.members.map(m =>
              m.user._id === userId ? {...m, user:{...m.user, status:'offline'}} : m
            )}))
          )
        })
      })
  }

  send(): void {
    const text = this.txt.trim()
    if (!text || !this.activeChat()) return
    const me = this.me()!
    const chat = this.activeChat()!

    // Optimistic message
    const tmp: Message = {
      _id: 'tmp_' + Date.now(),
      chat: chat._id,
      sender: {_id: me._id, name: me.name, avatar: me.avatar},
      type: 'text',
      content: text,
      replyTo: this.replyTo() as any,
      reactions: [],
      readBy: [],
      isDeleted: false,
      createdAt: new Date().toISOString(),
    }

    this.chatSvc.addMessage(tmp)
    this.socket.sendMessage(chat._id, text, 'text', this.replyTo()?._id || null)
    this.txt = ''
    this.replyTo.set(null)
    this.doScroll = true
    this.stopType()
  }

  onType(): void {
    if (!this.activeChat()) return
    this.socket.sendTypingStart(this.activeChat()!._id)
    clearTimeout(this.typingTimer)
    this.typingTimer = setTimeout(() => this.stopType(), 2000)
  }

  stopType(): void {
    if (!this.activeChat()) return
    clearTimeout(this.typingTimer)
    this.socket.sendTypingStop(this.activeChat()!._id)
  }

  setReply(m: Message): void { if (!m.isDeleted) this.replyTo.set(m) }

  react(m: Message, emoji: string): void {
    if (!this.activeChat()) return
    this.socket.reactToMessage(m._id, this.activeChat()!._id, emoji)
  }

  findPeople(q: string): void {
    if (!q.trim()) { this.people.set([]); return }
    this.searching.set(true)
    this.chatSvc.searchUsers(q).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r: any) => { this.people.set(r.data.users); this.searching.set(false) },
      error: () => this.searching.set(false),
    })
  }

  openChat(userId: string, name: string): void {
    this.chatSvc.createOrGetChat(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r: any) => {
        this.showPeople.set(false)
        this.people.set([])
        this.pq = ''
        this.pick(r.data.chat)
      },
      error: () => this.snack.open('Failed to open chat','✕'),
    })
  }

  onFile(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0]
    if (!f) return
    this.snack.open(`📎 ${f.name} — file upload in Phase 8!`, '✕', {duration: 3000})
  }

  logout(): void { this.auth.logout() }

  // Calls
 callAudio(): void {
  const other = this.getOtherUser()
  if (!other || !this.activeChat()) return
  this.callSvc.pendingCallerName = this.me()?.name || 'Someone'
  this.callSvc.startCall(this.activeChat()!._id, other._id, other.name, 'audio')
}

callVideo(): void {
  const other = this.getOtherUser()
  if (!other || !this.activeChat()) return
  this.callSvc.pendingCallerName = this.me()?.name || 'Someone'
  this.callSvc.startCall(this.activeChat()!._id, other._id, other.name, 'video')
}

  private getOtherUser() {
    const chat = this.activeChat()
    if (!chat) return null
    return this.chatSvc.getChatOtherUser(chat, this.me()?._id || '')
  }

  // Scroll
  onScroll(e: Event): void {
    const el = e.target as HTMLElement
    this.doScroll = el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }

  scrollBottom(): void {
    try { this.anchor?.nativeElement?.scrollIntoView({behavior:'smooth'}) } catch {}
  }

  // Helpers
  isOut(m: Message): boolean { return m.sender._id === this.me()?._id }
  isRead(m: Message): boolean {
  // Message is read if anyone OTHER than sender has readBy entry
  return m.readBy.some((r: any) => {
    const readerId = typeof r.user === 'object' ? r.user._id : r.user
    return readerId !== this.me()?._id
  })
}
  isTypingIn(chatId: string): boolean { return (this.typing()[chatId]||[]).length > 0 }
  hasUnread(c: Chat): boolean { return (c.unreadCount||0) > 0 }

  chatName(c: Chat): string { return this.chatSvc.getChatDisplayName(c, this.me()?._id||'') }
  chatStatus(c: Chat): string {
    if (c.type==='group') return 'online'
    return this.chatSvc.getChatOtherUser(c, this.me()?._id||'')?.status || 'offline'
  }
  chatStatusTxt(c: Chat): string {
    if (c.type==='group') return `${c.members.length} members`
    return this.chatStatus(c) === 'online' ? 'Active now' : 'Offline'
  }
  preview(c: Chat): string {
    if (!c.lastMessage) return 'No messages yet'
    if (c.lastMessage.isDeleted) return '🚫 Message deleted'
    const mine = c.lastMessage.sender._id === this.me()?._id
    return (mine ? 'You: ' : '') + (c.lastMessage.content?.slice(0,42)||'')
  }
  avatarColor(name: string): string { return this.chatSvc.getAvatarColor(name) }
  initials(name: string): string { return this.chatSvc.getInitials(name) }
  groupReacts(m: Message): {emoji:string;count:number}[] {
    const map: Record<string,number> = {}
    m.reactions.forEach(r => { map[r.emoji] = (map[r.emoji]||0)+1 })
    return Object.entries(map).map(([emoji,count]) => ({emoji,count}))
  }
  fmtTime(d: string): string {
    return new Date(d).toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',hour12:true})
  }
  fmtDate(d: string): string {
    const dt = new Date(d), t = new Date(), y = new Date(t)
    y.setDate(t.getDate()-1)
    if (dt.toDateString()===t.toDateString()) return 'Today'
    if (dt.toDateString()===y.toDateString()) return 'Yesterday'
    return dt.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})
  }
}