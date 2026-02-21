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

  <!-- SIDEBAR -->
  <aside class="sidebar" [class.hidden]="activeChat()&&mobile()">
    <div class="sb-head">
      <div class="sb-brand">
        <div class="brand-logo">S</div>
        <span class="brand-name">Saylo</span>
      </div>
      <div class="sb-actions">
        <button class="icon-btn" (click)="showPeople.set(true)" title="New chat">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        </button>
        <button class="icon-btn" (click)="logout()" title="Logout">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    </div>

    <!-- User profile strip -->
    <div class="my-profile">
      <div class="my-av" [style.background]="avatarColor(me()?.name||'U')">{{initials(me()?.name||'U')}}</div>
      <div class="my-info">
        <span class="my-name">{{me()?.name}}</span>
        <span class="my-status">🟢 Active</span>
      </div>
    </div>

    <div class="sb-search">
      <div class="search-box">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
        <input placeholder="Search conversations..." [(ngModel)]="sq">
        @if(sq){<button class="clr-btn" (click)="sq=''">✕</button>}
      </div>
    </div>

    <!-- People panel -->
    @if(showPeople()){
      <div class="people-panel">
        <div class="pp-head">
          <span>New Conversation</span>
          <button class="icon-btn sm" (click)="showPeople.set(false);pq='';people.set([])">✕</button>
        </div>
        <div class="pp-search">
          <input class="pp-input" placeholder="Search by name or email..." [(ngModel)]="pq" (ngModelChange)="findPeople($event)" autofocus>
        </div>
        @if(searching()){
          <div class="pp-loading"><div class="spin"></div></div>
        }
        @for(u of people();track u._id){
          <div class="pp-user" (click)="openChat(u._id, u.name)">
            <div class="pp-av" [style.background]="avatarColor(u.name)">{{initials(u.name)}}</div>
            <div class="pp-info">
              <span class="pp-name">{{u.name}}</span>
              <span class="pp-email">{{u.email}}</span>
            </div>
            <div class="pp-status-dot" [class.online]="u.status==='online'"></div>
          </div>
        }
        @if(!searching()&&pq&&people().length===0){
          <div class="pp-empty">No users found for "{{pq}}"</div>
        }
        @if(!pq){
          <div class="pp-hint">Type a name or email to search</div>
        }
      </div>
    }

    <div class="sb-list">
      @if(loading()){
        @for(i of [1,2,3,4];track i){
          <div class="ske-item">
            <div class="ske-av skeleton"></div>
            <div class="ske-body">
              <div class="skeleton" style="height:11px;width:50%;border-radius:6px"></div>
              <div class="skeleton" style="height:10px;width:75%;border-radius:6px;margin-top:6px"></div>
            </div>
          </div>
        }
      } @else if(filteredChats().length===0){
        <div class="sb-empty">
          <div class="empty-icon">💬</div>
          <p>No conversations yet</p>
          <button class="start-btn" (click)="showPeople.set(true)">Start chatting</button>
        </div>
      } @else {
        @for(c of filteredChats();track c._id){
          <div class="ci" [class.active]="activeChat()?._id===c._id" (click)="pick(c)">
            <div class="ci-av" [style.background]="avatarColor(chatName(c))">
              {{initials(chatName(c))}}
              <span class="ci-dot" [class.online]="chatStatus(c)==='online'"></span>
            </div>
            <div class="ci-body">
              <div class="ci-top">
                <span class="ci-name">{{chatName(c)}}</span>
                <span class="ci-time">{{c.lastMessage?.createdAt|timeAgo}}</span>
              </div>
              <div class="ci-bottom">
                <span class="ci-preview" [class.unread]="hasUnread(c)">
                  @if(isTypingIn(c._id)){<em>typing...</em>}
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
        <div class="welcome-art">
          <div class="w-circle c1"></div>
          <div class="w-circle c2"></div>
          <div class="w-logo">S</div>
        </div>
        <h2>Welcome to Saylo</h2>
        <p>Select a conversation or start a new one</p>
        <button class="start-btn" (click)="showPeople.set(true)">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          New Conversation
        </button>
      </div>
    } @else {

      <!-- HEADER -->
      <header class="chat-header">
        @if(mobile()){
          <button class="icon-btn" (click)="chatSvc.activeChat.set(null)">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
        }
        <div class="header-av" [style.background]="avatarColor(chatName(activeChat()!))">
          {{initials(chatName(activeChat()!))}}
        </div>
        <div class="header-info">
          <div class="header-name">{{chatName(activeChat()!)}}</div>
          <div class="header-status">
            @if(isTypingIn(activeChat()!._id)){
              <span class="typing-status">
                <span class="td"></span><span class="td"></span><span class="td"></span>
                typing...
              </span>
            } @else {
              <span class="status-dot" [class.online]="chatStatus(activeChat()!)==='online'"></span>
              {{chatStatusTxt(activeChat()!)}}
            }
          </div>
        </div>

        <!-- CALL BUTTONS -->
        <div class="header-calls">
          <button class="call-btn audio" title="Audio Call" (click)="callAudio()">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </button>
          <button class="call-btn video" title="Video Call" (click)="callVideo()">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- MESSAGES -->
      <div class="msgs" #msgsEl (scroll)="onScroll($event)">
        @if(loadingMsgs()){
          <div class="msgs-load"><div class="spin"></div></div>
        }
        @for(g of msgGroups();track g.date){
          <div class="date-sep"><span>{{g.date}}</span></div>
          @for(m of g.messages;track m._id){
            <div class="msg-row" [class.out]="isOut(m)">
              @if(!isOut(m)){
                <div class="msg-av" [style.background]="avatarColor(m.sender.name)">{{initials(m.sender.name)}}</div>
              }
              <div class="msg-wrap">
                @if(m.replyTo){
                  <div class="reply-preview" [class.out]="isOut(m)">
                    <span class="reply-name">{{m.replyTo.sender?.name}}</span>
                    <span class="reply-text">{{m.replyTo.content|slice:0:60}}</span>
                  </div>
                }
                <div class="bubble" [class.out]="isOut(m)" [class.inc]="!isOut(m)" [class.deleted]="m.isDeleted" (dblclick)="setReply(m)">
                  @if(m.isDeleted){
                    <span class="deleted-text">🚫 Message deleted</span>
                  } @else {
                    <span class="bubble-text">{{m.content}}</span>
                  }
                  <div class="bubble-meta">
                    <span class="msg-time">{{fmtTime(m.createdAt)}}</span>
                    @if(isOut(m)){
                      <span class="read-tick" [class.read]="isRead(m)">
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                          <path d="M1 5L5 9L15 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                          @if(isRead(m)){<path d="M6 5L10 9L15 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>}
                        </svg>
                      </span>
                    }
                  </div>
                </div>
                @if(m.reactions.length>0){
                  <div class="reactions" [class.out]="isOut(m)">
                    @for(r of groupReacts(m);track r.emoji){
                      <button class="react-pill" (click)="react(m, r.emoji)">{{r.emoji}} {{r.count}}</button>
                    }
                  </div>
                }
              </div>
            </div>
          }
        }
        @if(isTypingIn(activeChat()!._id)){
          <div class="msg-row">
            <div class="msg-av" style="background:#E8E1D9">💬</div>
            <div class="typing-bubble">
              <span class="td"></span><span class="td"></span><span class="td"></span>
            </div>
          </div>
        }
        <div #anchor></div>
      </div>

      <!-- REPLY STRIP -->
      @if(replyTo()){
        <div class="reply-strip">
          <div class="reply-bar"></div>
          <div class="reply-strip-info">
            <span class="reply-strip-name">↩ {{replyTo()!.sender.name}}</span>
            <span class="reply-strip-text">{{replyTo()!.content|slice:0:80}}</span>
          </div>
          <button class="icon-btn sm" (click)="replyTo.set(null)">✕</button>
        </div>
      }

      <!-- INPUT -->
      <div class="input-bar">
        <div class="input-wrap" [class.focused]="inpFocus()">
          <button class="inp-icon-btn" title="Attach">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
          </button>
          <input
            #msgInp
            class="msg-input"
            type="text"
            [placeholder]="'Message ' + chatName(activeChat()!) + '...'"
            [(ngModel)]="txt"
            (ngModelChange)="onType()"
            (keydown.enter)="send()"
            (focus)="inpFocus.set(true)"
            (blur)="inpFocus.set(false); stopType()"
          >
          <button class="inp-icon-btn" title="Emoji">😊</button>
        </div>
        <button class="send-btn" [class.active]="txt.trim()" (click)="send()">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    }
  </main>

  <app-call/>
</div>
  `,
  styles: [`
    :host { display:flex; height:100vh; overflow:hidden; }

    .shell {
      display: grid;
      grid-template-columns: 320px 1fr;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: var(--bg-primary);
      font-family: var(--font-body);
    }

    /* ── SIDEBAR ── */
    .sidebar {
      background: var(--bg-secondary);
      border-right: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .sb-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 16px 12px;
      border-bottom: 1px solid var(--border-light);
    }

    .sb-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-logo {
      width: 36px; height: 36px;
      background: var(--grad-brand);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display);
      font-weight: 700; font-size: 16px; color: #fff;
      box-shadow: 0 4px 12px rgba(124,106,245,.3);
    }

    .brand-name {
      font-family: var(--font-display);
      font-size: 20px; font-weight: 700;
      color: var(--text-primary);
    }

    .sb-actions { display: flex; gap: 4px; }

    .icon-btn {
      width: 36px; height: 36px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      background: none; border: none; cursor: pointer;
      color: var(--text-muted);
      transition: all .15s;
    }
    .icon-btn:hover { background: var(--bg-hover); color: var(--accent-primary); }
    .icon-btn.sm { width: 28px; height: 28px; border-radius: 8px; }

    .my-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border-light);
    }

    .my-av {
      width: 38px; height: 38px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display);
      font-weight: 700; font-size: 13px; color: #fff;
      flex-shrink: 0;
    }

    .my-name {
      display: block;
      font-size: 13.5px; font-weight: 600;
      color: var(--text-primary);
    }

    .my-status { font-size: 11px; color: var(--text-muted); }

    .sb-search { padding: 12px 12px 8px; }

    .search-box {
      display: flex; align-items: center; gap: 8px;
      background: var(--bg-elevated);
      border: 1.5px solid var(--border-light);
      border-radius: 12px;
      padding: 9px 12px;
      transition: border-color .15s;
    }

    .search-box:focus-within { border-color: var(--accent-primary); }
    .search-box svg { color: var(--text-muted); flex-shrink: 0; }
    .search-box input {
      flex: 1; background: none; border: none; outline: none;
      font-size: 13.5px; color: var(--text-primary);
    }
    .search-box input::placeholder { color: var(--text-muted); }
    .clr-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 11px; min-height: unset; min-width: unset; }

    /* People panel */
    .people-panel {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--bg-secondary);
      z-index: 50;
      display: flex; flex-direction: column;
      box-shadow: var(--shadow-lg);
    }

    .pp-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--border-light);
      font-family: var(--font-display);
      font-size: 16px; font-weight: 600;
    }

    .pp-search { padding: 12px 16px; }

    .pp-input {
      width: 100%;
      padding: 10px 14px;
      background: var(--bg-elevated);
      border: 1.5px solid var(--border-light);
      border-radius: 12px;
      font-size: 14px;
      color: var(--text-primary);
      transition: border-color .15s;
    }
    .pp-input:focus { border-color: var(--accent-primary); }
    .pp-input::placeholder { color: var(--text-muted); }

    .pp-loading { display: flex; justify-content: center; padding: 20px; }

    .pp-user {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid var(--border-light);
      transition: background .12s;
    }
    .pp-user:hover { background: var(--bg-hover); }

    .pp-av {
      width: 42px; height: 42px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display);
      font-weight: 700; font-size: 14px; color: #fff;
      flex-shrink: 0;
    }

    .pp-info { flex: 1; }
    .pp-name { display: block; font-size: 14px; font-weight: 600; }
    .pp-email { font-size: 12px; color: var(--text-muted); }

    .pp-status-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: var(--text-muted);
      border: 2px solid #fff;
    }
    .pp-status-dot.online { background: var(--accent-green); }

    .pp-empty, .pp-hint {
      padding: 24px;
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
    }

    .sb-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px;
    }

    .ske-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px;
    }
    .ske-av {
      width: 44px; height: 44px;
      border-radius: 50%; flex-shrink: 0;
    }
    .ske-body { flex: 1; display: flex; flex-direction: column; gap: 6px; }

    .skeleton {
      background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%);
      background-size: 200% 100%;
      animation: skelPulse 1.4s ease infinite;
    }
    @keyframes skelPulse { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    .sb-empty {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      height: 200px; gap: 10px;
      text-align: center; color: var(--text-muted);
    }
    .empty-icon { font-size: 40px; }

    .start-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px;
      background: var(--grad-brand);
      color: #fff; border: none; border-radius: 12px;
      font-family: var(--font-body);
      font-size: 13.5px; font-weight: 600;
      cursor: pointer;
      transition: all .2s;
      box-shadow: 0 4px 12px rgba(124,106,245,.3);
      margin-top: 8px;
      min-height: unset;
    }
    .start-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,106,245,.4); }

    /* Chat item */
    .ci {
      display: flex; align-items: center; gap: 10px;
      padding: 10px;
      border-radius: 14px;
      cursor: pointer;
      transition: background .12s;
      margin-bottom: 2px;
    }
    .ci:hover { background: var(--bg-hover); }
    .ci.active { background: rgba(124,106,245,.1); }

    .ci-av {
      width: 46px; height: 46px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display);
      font-weight: 700; font-size: 14px; color: #fff;
      flex-shrink: 0; position: relative;
    }

    .ci-dot {
      position: absolute; bottom: 1px; right: 1px;
      width: 11px; height: 11px;
      border-radius: 50%;
      background: var(--text-muted);
      border: 2px solid var(--bg-secondary);
    }
    .ci-dot.online { background: var(--accent-green); }

    .ci-body { flex: 1; min-width: 0; }
    .ci-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px; }
    .ci-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .ci-time { font-size: 10.5px; color: var(--text-muted); flex-shrink: 0; }
    .ci-bottom { display: flex; align-items: center; justify-content: space-between; }
    .ci-preview { font-size: 12.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
    .ci-preview.unread { color: var(--text-secondary); font-weight: 500; }
    .ci-badge {
      min-width: 18px; height: 18px; padding: 0 5px;
      background: var(--accent-primary);
      border-radius: 9px; font-size: 10px; font-weight: 700;
      color: #fff; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── MAIN ── */
    .main {
      display: flex; flex-direction: column;
      height: 100vh; overflow: hidden;
      background: var(--bg-primary);
    }

    .welcome {
      flex: 1;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 14px; text-align: center;
      padding: 20px;
    }

    .welcome-art {
      position: relative;
      width: 90px; height: 90px;
      margin-bottom: 8px;
    }

    .w-circle {
      position: absolute; border-radius: 50%;
    }
    .c1 {
      width: 80px; height: 80px;
      background: rgba(124,106,245,.12);
      top: 5px; left: 5px;
      animation: pulse 2s ease infinite;
    }
    .c2 {
      width: 60px; height: 60px;
      background: rgba(245,166,35,.1);
      top: 15px; left: 15px;
      animation: pulse 2s ease infinite .5s;
    }

    .w-logo {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 52px; height: 52px;
      background: var(--grad-brand);
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display);
      font-weight: 700; font-size: 22px; color: #fff;
      box-shadow: 0 6px 20px rgba(124,106,245,.35);
    }

    .welcome h2 {
      font-family: var(--font-display);
      font-size: 26px; font-weight: 700;
      color: var(--text-primary);
    }

    .welcome p { color: var(--text-muted); font-size: 14px; }

    /* Chat Header */
    .chat-header {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm);
      flex-shrink: 0;
      min-height: 66px;
    }

    .header-av {
      width: 40px; height: 40px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display);
      font-weight: 700; font-size: 13px; color: #fff;
      flex-shrink: 0;
    }

    .header-info { flex: 1; }
    .header-name { font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .header-status {
      font-size: 12px; color: var(--text-muted);
      display: flex; align-items: center; gap: 5px; margin-top: 2px;
    }

    .status-dot {
      width: 7px; height: 7px;
      border-radius: 50%; background: var(--text-muted);
      display: inline-block;
    }
    .status-dot.online { background: var(--accent-green); }

    .typing-status {
      display: flex; align-items: center; gap: 4px;
      color: var(--accent-primary); font-style: italic;
    }

    /* CALL BUTTONS */
    .header-calls { display: flex; gap: 8px; }

    .call-btn {
      width: 40px; height: 40px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer;
      transition: all .2s;
    }

    .call-btn.audio {
      background: rgba(46,204,113,.12);
      color: #2ECC71;
    }
    .call-btn.audio:hover {
      background: var(--grad-green);
      color: #fff;
      box-shadow: 0 4px 14px rgba(46,204,113,.35);
      transform: translateY(-1px);
    }

    .call-btn.video {
      background: rgba(52,152,219,.12);
      color: #3498DB;
    }
    .call-btn.video:hover {
      background: linear-gradient(135deg, #3498DB, #2980B9);
      color: #fff;
      box-shadow: 0 4px 14px rgba(52,152,219,.35);
      transform: translateY(-1px);
    }

    /* Messages */
    .msgs {
      flex: 1; overflow-y: auto;
      padding: 16px 20px;
      display: flex; flex-direction: column;
      gap: 4px; min-height: 0;
    }

    .msgs-load { display: flex; justify-content: center; padding: 30px; }

    .date-sep {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 0; flex-shrink: 0;
    }
    .date-sep::before, .date-sep::after {
      content: ''; flex: 1; height: 1px;
      background: var(--border-light);
    }
    .date-sep span {
      font-size: 11px; color: var(--text-muted);
      font-weight: 500;
      padding: 3px 12px;
      background: var(--bg-elevated);
      border-radius: 20px;
      border: 1px solid var(--border-light);
      white-space: nowrap;
    }

    .msg-row {
      display: flex; align-items: flex-end; gap: 8px;
      animation: fadeUp .2s ease forwards;
    }
    .msg-row.out { flex-direction: row-reverse; }

    .msg-av {
      width: 28px; height: 28px;
      border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; color: #fff;
      font-family: var(--font-display);
      margin-bottom: 2px;
    }

    .msg-wrap { max-width: 65%; display: flex; flex-direction: column; gap: 3px; }
    .msg-row.out .msg-wrap { align-items: flex-end; }

    .reply-preview {
      padding: 6px 10px;
      background: var(--bg-elevated);
      border-left: 3px solid var(--accent-primary);
      border-radius: 8px;
      margin-bottom: 3px;
    }
    .reply-preview.out { border-left-color: rgba(255,255,255,.4); }
    .reply-name { display: block; font-size: 10.5px; font-weight: 600; color: var(--accent-primary); }
    .reply-text { font-size: 11.5px; color: var(--text-muted); }

    .bubble {
      padding: 10px 14px;
      border-radius: 18px;
      word-break: break-word;
    }

    .bubble.inc {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-bottom-left-radius: 4px;
      color: var(--text-primary);
      box-shadow: var(--shadow-sm);
    }

    .bubble.out {
      background: var(--grad-brand);
      color: #fff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 12px rgba(124,106,245,.25);
    }

    .bubble.deleted { opacity: .6; }

    .bubble-text { font-size: 14px; line-height: 1.5; }
    .deleted-text { font-size: 13px; font-style: italic; opacity: .7; }

    .bubble-meta {
      display: flex; align-items: center; justify-content: flex-end;
      gap: 4px; margin-top: 4px;
    }

    .msg-time { font-size: 10px; opacity: .65; }
    .bubble.out .msg-time { color: rgba(255,255,255,.85); }

    .read-tick { display: flex; align-items: center; color: rgba(255,255,255,.65); }
    .read-tick.read { color: #a8f0d8; }

    .reactions { display: flex; gap: 4px; flex-wrap: wrap; }
    .reactions.out { justify-content: flex-end; }
    .react-pill {
      background: var(--bg-elevated);
      border: 1px solid var(--border-light);
      border-radius: 20px; padding: 2px 8px;
      font-size: 12px; cursor: pointer;
      transition: all .12s; min-height: unset; min-width: unset;
    }
    .react-pill:hover { border-color: var(--accent-primary); }

    .typing-bubble {
      display: flex; align-items: center; gap: 4px;
      padding: 12px 16px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: 18px; border-bottom-left-radius: 4px;
      box-shadow: var(--shadow-sm);
    }

    .td {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--accent-primary);
      display: inline-block;
      animation: bounce 1.2s ease infinite;
    }
    .td:nth-child(2) { animation-delay: .2s; }
    .td:nth-child(3) { animation-delay: .4s; }

    /* Reply strip */
    .reply-strip {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 16px;
      background: var(--bg-elevated);
      border-top: 1px solid var(--border-light);
      flex-shrink: 0;
    }
    .reply-bar { width: 3px; height: 32px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0; }
    .reply-strip-info { flex: 1; }
    .reply-strip-name { display: block; font-size: 11px; font-weight: 600; color: var(--accent-primary); }
    .reply-strip-text { font-size: 12px; color: var(--text-muted); }

    /* Input */
    .input-bar {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-light);
      flex-shrink: 0;
    }

    .input-wrap {
      flex: 1; display: flex; align-items: center; gap: 8px;
      background: var(--bg-elevated);
      border: 1.5px solid var(--border-light);
      border-radius: 24px; padding: 8px 14px;
      transition: border-color .15s;
    }
    .input-wrap.focused { border-color: var(--accent-primary); }

    .msg-input {
      flex: 1; background: none; border: none; outline: none;
      font-size: 14px; color: var(--text-primary);
    }
    .msg-input::placeholder { color: var(--text-muted); }

    .inp-icon-btn {
      background: none; border: none; cursor: pointer;
      color: var(--text-muted); font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: color .15s; min-height: unset; min-width: unset;
      width: 28px; height: 28px;
    }
    .inp-icon-btn:hover { color: var(--accent-primary); }

    .send-btn {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--bg-elevated);
      border: 1.5px solid var(--border-light);
      cursor: pointer; color: var(--text-muted);
      transition: all .2s cubic-bezier(.34,1.56,.64,1);
    }
    .send-btn.active {
      background: var(--grad-brand);
      border-color: transparent; color: #fff;
      box-shadow: 0 4px 14px rgba(124,106,245,.4);
    }
    .send-btn.active:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(124,106,245,.5);
    }

    .spin {
      width: 22px; height: 22px;
      border: 2.5px solid var(--border-light);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-6px);opacity:1} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

    /* ── MOBILE ── */
    @media (max-width: 768px) {
      .shell { grid-template-columns: 100% !important; }
      .sidebar { width: 100%; position: absolute; inset: 0; z-index: 10; }
      .sidebar.hidden { display: none; }
      .main { position: absolute; inset: 0; z-index: 10; }
      .main:not(.show) { display: none; }
      .msgs { padding: 12px; }
      .msg-wrap { max-width: 80%; }
      .chat-header { padding: 10px 14px; }
      .input-bar { padding: 10px 12px; padding-bottom: calc(10px + env(safe-area-inset-bottom)); }
      .bubble-text { font-size: 15px; }
      .call-btn { width: 36px; height: 36px; }
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
  inpFocus    = signal(false)
  searching   = signal(false)
  replyTo     = signal<Message|null>(null)
  people      = signal<any[]>([])

  sq  = ''
  pq  = ''
  txt = ''

  filteredChats = computed(() => {
    let list = this.chats()
    if (this.sq) list = list.filter(c => this.chatName(c).toLowerCase().includes(this.sq.toLowerCase()))
    return list
  })

  msgGroups = computed(() => {
    const msgs = this.messages()
    if (!msgs.length) return []
    const groups: {date:string; messages:any[]}[] = []
    let curDate = '', curMsgs: any[] = []
    msgs.forEach(m => {
      const d = this.fmtDate(m.createdAt)
      if (d !== curDate) {
        if (curMsgs.length) groups.push({date: curDate, messages: curMsgs})
        curDate = d; curMsgs = [{...m}]
      } else curMsgs.push({...m})
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
    this.socket.connect(this.me()?._id || '')
    this.loading.set(true)
    this.chatSvc.getMyChats().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    })
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

  pick(chat: Chat): void {
    if (this.activeChat()?._id === chat._id) return
    if (this.activeChat()) this.socket.leaveChat(this.activeChat()!._id)
    this.chatSvc.activeChat.set(chat)
    this.chatSvc.messages.set([])
    this.replyTo.set(null)
    this.doScroll = true
    this.loadingMsgs.set(true)
    this.chatSvc.getMessages(chat._id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.loadingMsgs.set(false); this.socket.joinChat(chat._id); this.doScroll = true },
      error: () => this.loadingMsgs.set(false),
    })
  }

  listenSocket(): void {
    this.socket.on<{message: Message}>('message:new').pipe(takeUntil(this.destroy$)).subscribe(({message}) => {
      this.zone.run(() => {
        if (message.chat === this.activeChat()?._id) {
          if (message.sender._id === this.me()?._id) {
            this.chatSvc.messages.update(ms => ms.filter(m => !m._id.startsWith('tmp_')))
          }
          this.chatSvc.addMessage(message)
          this.doScroll = true
        } else {
          this.chatSvc.chats.update(list => list.map(c =>
            c._id === message.chat ? {...c, lastMessage: message, unreadCount: (c.unreadCount||0)+1} : c
          ))
        }
      })
    })

    this.socket.on<{userId:string;chatId:string}>('typing:start').pipe(takeUntil(this.destroy$)).subscribe(({userId, chatId}) => {
      if (userId !== this.me()?._id) this.chatSvc.setTyping(chatId, userId, true)
    })

    this.socket.on<{userId:string;chatId:string}>('typing:stop').pipe(takeUntil(this.destroy$)).subscribe(({userId, chatId}) => {
      this.chatSvc.setTyping(chatId, userId, false)
    })

    this.socket.on<{userId:string}>('user:online').pipe(takeUntil(this.destroy$)).subscribe(({userId}) => {
      this.zone.run(() => {
        this.chatSvc.chats.update(list => list.map(c => ({...c, members: c.members.map((m:any) =>
          m.user._id === userId ? {...m, user:{...m.user, status:'online'}} : m
        )})))
      })
    })

    this.socket.on<{userId:string}>('user:offline').pipe(takeUntil(this.destroy$)).subscribe(({userId}) => {
      this.zone.run(() => {
        this.chatSvc.chats.update(list => list.map(c => ({...c, members: c.members.map((m:any) =>
          m.user._id === userId ? {...m, user:{...m.user, status:'offline'}} : m
        )})))
      })
    })

    this.socket.on<{userIds:string[]}>('users:online-list').pipe(takeUntil(this.destroy$)).subscribe(({userIds}) => {
      this.zone.run(() => {
        this.chatSvc.chats.update(list => list.map(c => ({...c, members: c.members.map((m:any) =>
          userIds.includes(m.user._id) ? {...m, user:{...m.user, status:'online'}} : m
        )})))
      })
    })
  }

  send(): void {
    const text = this.txt.trim()
    if (!text || !this.activeChat()) return
    const me = this.me()!
    const chat = this.activeChat()!
    const tmp: Message = {
      _id: 'tmp_' + Date.now(), chat: chat._id,
      sender: {_id: me._id, name: me.name, email: me.email||'', avatar: me.avatar, status: 'online'},
      type: 'text', content: text,
      replyTo: this.replyTo() as any,
      reactions: [], readBy: [],
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.chatSvc.addMessage(tmp)
    this.socket.sendMessage(chat._id, text)
    this.txt = ''
    this.replyTo.set(null)
    this.doScroll = true
    this.stopType()
  }

  onType(): void {
    if (!this.activeChat()) return
    this.socket.sendTypingStart(this.activeChat()!._id, this.me()?._id||""  , this.me()?.name||"")
    clearTimeout(this.typingTimer)
    this.typingTimer = setTimeout(() => this.stopType(), 2000)
  }

  stopType(): void {
    if (!this.activeChat()) return
    clearTimeout(this.typingTimer)
    this.socket.sendTypingStop(this.activeChat()!._id, this.me()?._id||"")
  }

  setReply(m: Message): void { if (!m.isDeleted) this.replyTo.set(m) }

  react(m: Message, emoji: string): void {
    if (!this.activeChat()) return
    this.socket.emit("message:react", { messageId: m._id, emoji, chatId: this.activeChat()!._id })
  }

  findPeople(q: string): void {
    if (!q.trim()) { this.people.set([]); return }
    this.searching.set(true)
    this.chatSvc.searchUsers(q).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r: any) => { this.people.set(r.data?.users || []); this.searching.set(false) },
      error: () => this.searching.set(false),
    })
  }

  openChat(userId: string, name: string): void {
    this.chatSvc.createOrGetChat(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r: any) => {
        this.showPeople.set(false)
        this.people.set([])
        this.pq = ''
        const chat = r.data?.chat || r.data
        if (chat) this.pick(this.chatSvc.chats().find(c => c._id === chat._id) || chat)
      },
      error: () => this.snack.open('Failed to open chat', '✕', {duration: 3000}),
    })
  }

  callAudio(): void {
    const other = this.getOtherUser()
    if (!other || !this.activeChat()) return
    this.callSvc.startCall(this.activeChat()!._id, other._id, other.name, 'audio')
  }

  callVideo(): void {
    const other = this.getOtherUser()
    if (!other || !this.activeChat()) return
    this.callSvc.startCall(this.activeChat()!._id, other._id, other.name, 'video')
  }

  private getOtherUser() {
    const chat = this.activeChat()
    if (!chat) return null
    return this.chatSvc.getChatOtherUser(chat, this.me()?._id || '')
  }

  logout(): void { this.auth.logout() }

  onScroll(e: Event): void {
    const el = e.target as HTMLElement
    this.doScroll = el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }

  scrollBottom(): void {
    try { this.anchor?.nativeElement?.scrollIntoView({behavior: 'smooth'}) } catch {}
  }

  isOut(m: Message): boolean { return m.sender._id === this.me()?._id }
  isRead(m: Message): boolean {
    return m.readBy.some((r: any) => {
      const id = typeof r.user === 'object' ? r.user._id : r.user
      return id !== this.me()?._id
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
    m.reactions.forEach((r:any) => { map[r.emoji] = (map[r.emoji]||0)+1 })
    return Object.entries(map).map(([emoji,count]) => ({emoji,count}))
  }
  fmtTime(d: string): string {
    return new Date(d).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit', hour12: true})
  }
  fmtDate(d: string): string {
    const dt = new Date(d), t = new Date(), y = new Date(t)
    y.setDate(t.getDate()-1)
    if (dt.toDateString()===t.toDateString()) return 'Today'
    if (dt.toDateString()===y.toDateString()) return 'Yesterday'
    return dt.toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'})
  }
}