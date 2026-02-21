import {
  Component, OnInit, OnDestroy,
  ViewChild, ElementRef, AfterViewChecked,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Subject, takeUntil } from 'rxjs'
import { AuthService, User } from '../../core/services/auth.service'
import { SocketService } from '../../core/services/socket.service'
import { ChatService, Chat, Message } from '../../core/services/chat.service'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="shell">

  <!-- ════════════════ SIDEBAR ════════════════ -->
  <aside class="sidebar" [class.open]="sidebarOpen">

    <!-- Sidebar Top Bar -->
    <div class="sb-topbar">
      <div class="sb-logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#2563eb"/>
          <circle cx="8"  cy="11" r="1" fill="white"/>
          <circle cx="12" cy="11" r="1" fill="white"/>
          <circle cx="16" cy="11" r="1" fill="white"/>
        </svg>
        <span>Saylo</span>
      </div>
      <button class="icon-btn" title="New chat" (click)="openNewChatModal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="sb-search-wrap">
      <div class="sb-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          class="sb-search-input"
          type="text"
          [(ngModel)]="searchQ"
          placeholder="Search chats..."
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="sb-tabs">
      <button class="sb-tab" [class.active]="tab==='chats'"  (click)="tab='chats'">Chats</button>
      <button class="sb-tab" [class.active]="tab==='people'" (click)="switchToPeople()">People</button>
    </div>

    <!-- ── CHATS LIST ── -->
    <div class="sb-list" *ngIf="tab==='chats'">
      <div class="empty-hint" *ngIf="filteredChats.length === 0">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <p>No conversations yet</p>
        <span>Tap + to start one</span>
      </div>

      <div
        class="chat-row"
        *ngFor="let c of filteredChats"
        [class.active]="activeChat?._id === c._id"
        (click)="openChat(c)"
      >
        <div class="avatar" [style.background]="colorFor(getChatName(c))">
          {{ getChatName(c).charAt(0).toUpperCase() }}
          <div class="green-dot" *ngIf="isOnline(c)"></div>
        </div>
        <div class="chat-row-info">
          <div class="chat-row-top">
            <span class="chat-row-name">{{ getChatName(c) }}</span>
            <span class="chat-row-time">{{ ago(c.lastActivity) }}</span>
          </div>
          <div class="chat-row-top">
            <span class="chat-row-preview">{{ c.lastMessageText || 'Start a conversation' }}</span>
            <span class="unread-dot" *ngIf="c.unread && c.unread > 0">{{ c.unread }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PEOPLE LIST ── -->
    <div class="sb-list" *ngIf="tab==='people'">
      <div class="loading-row" *ngIf="loadingPeople">
        <div class="mini-spin"></div> Loading...
      </div>
      <div class="empty-hint" *ngIf="!loadingPeople && filteredPeople.length === 0">
        <p>No users found</p>
      </div>
      <div
        class="chat-row"
        *ngFor="let u of filteredPeople"
        (click)="startChat(u)"
      >
        <div class="avatar" [style.background]="colorFor(u.name)">
          {{ u.name.charAt(0).toUpperCase() }}
          <div class="green-dot" *ngIf="onlineIds.includes(u._id)"></div>
        </div>
        <div class="chat-row-info">
          <div class="chat-row-top">
            <span class="chat-row-name">{{ u.name }}</span>
            <span class="chat-row-time" *ngIf="onlineIds.includes(u._id)" style="color:#22c55e">Online</span>
          </div>
          <span class="chat-row-preview">{{ u.email }}</span>
        </div>
      </div>
    </div>

    <!-- Sidebar Footer -->
    <div class="sb-footer">
      <div class="sb-profile">
        <div class="avatar sm" [style.background]="colorFor(me?.name||'')">
          {{ me?.name?.charAt(0)?.toUpperCase() }}
          <div class="green-dot"></div>
        </div>
        <div>
          <div class="sb-profile-name">{{ me?.name }}</div>
          <div class="sb-profile-status">Online</div>
        </div>
      </div>
      <button class="icon-btn red-hover" title="Sign out" (click)="logout()">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </aside>

  <!-- ════════════════ MAIN ════════════════ -->
  <main class="main">

    <!-- Mobile top bar -->
    <div class="mobile-topbar">
      <button class="icon-btn" (click)="sidebarOpen = !sidebarOpen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <span>{{ activeChat ? getChatName(activeChat) : 'Saylo' }}</span>
    </div>

    <!-- ── EMPTY STATE (no chat selected) ── -->
    <div class="no-chat" *ngIf="!activeChat">
      <div class="no-chat-box">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <h3>Pick a conversation</h3>
        <p>Select a chat from the sidebar or start a new one</p>
        <button class="start-btn" (click)="openNewChatModal()">
          Start a conversation
        </button>
      </div>
    </div>

    <!-- ── ACTIVE CHAT ── -->
    <div class="chat-view" *ngIf="activeChat">

      <!-- Chat Header -->
      <div class="chat-header">
        <button class="icon-btn back-btn" (click)="activeChat=null; sidebarOpen=true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div class="avatar" [style.background]="colorFor(getChatName(activeChat))">
          {{ getChatName(activeChat).charAt(0).toUpperCase() }}
          <div class="green-dot" *ngIf="isOnline(activeChat)"></div>
        </div>

        <div class="header-info">
          <span class="header-name">{{ getChatName(activeChat) }}</span>
          <span class="header-status">
            <ng-container *ngIf="typingUsers.length > 0">
              <span class="typing-label">typing...</span>
            </ng-container>
            <ng-container *ngIf="typingUsers.length === 0">
              <span *ngIf="isOnline(activeChat)"  class="online-label">Online</span>
              <span *ngIf="!isOnline(activeChat)" class="offline-label">Offline</span>
            </ng-container>
          </span>
        </div>

        <div class="header-actions">
          <button class="icon-btn" title="Voice call (Phase 6)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </button>
          <button class="icon-btn" title="Video call (Phase 6)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="msgs-area" #scrollEl>
        <div class="msgs-inner">

          <!-- Loading -->
          <div class="msgs-loading" *ngIf="loadingMsgs">
            <div class="mini-spin"></div>
          </div>

          <!-- Empty chat -->
          <div class="msgs-empty" *ngIf="!loadingMsgs && messages.length === 0">
            <p>No messages yet — say hello! 👋</p>
          </div>

          <!-- Message bubbles -->
          <ng-container *ngFor="let msg of messages; let i = index">

            <!-- Date separator -->
            <div class="date-sep" *ngIf="showDateSep(i)">
              <span>{{ formatDate(msg.createdAt) }}</span>
            </div>

            <!-- Bubble row -->
            <div class="bubble-row" [class.mine]="isMine(msg)">
              <!-- Other person avatar -->
              <div
                class="avatar xs"
                *ngIf="!isMine(msg)"
                [style.background]="colorFor(msg.sender?.name || '')"
              >
                {{ (msg.sender?.name || 'U').charAt(0).toUpperCase() }}
              </div>

              <div class="bubble-wrap">
                <!-- Sender name in group chats -->
                <span
                  class="sender-name"
                  *ngIf="activeChat.type==='group' && !isMine(msg)"
                >{{ msg.sender?.name }}</span>

                <div class="bubble" [class.mine-bubble]="isMine(msg)" [class.deleted]="msg.isDeleted">
                  {{ msg.content }}
                </div>

                <div class="bubble-meta" [class.mine-meta]="isMine(msg)">
                  <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
                  <!-- Read tick for sent messages -->
                  <svg *ngIf="isMine(msg)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
            </div>
          </ng-container>

          <!-- Typing indicator -->
          <div class="bubble-row" *ngIf="typingUsers.length > 0">
            <div class="avatar xs" style="background:#2563eb">...</div>
            <div class="bubble-wrap">
              <div class="bubble typing-bubble">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <div #anchor></div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="input-area">
        <div class="input-row">
          <div class="input-box" [class.focused]="inputFocused">
            <input
              class="msg-input"
              type="text"
              [(ngModel)]="msgText"
              (keydown.enter)="send()"
              (input)="onTyping()"
              (focus)="inputFocused=true"
              (blur)="inputFocused=false"
              placeholder="Type a message..."
              [disabled]="sending"
              #inputEl
            />
          </div>
          <button
            class="send-btn"
            (click)="send()"
            [disabled]="!msgText.trim() || sending"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  </main>

  <!-- ════════════════ NEW CHAT MODAL ════════════════ -->
  <div class="backdrop" *ngIf="showModal" (click)="showModal=false">
    <div class="modal" (click)="$event.stopPropagation()">

      <div class="modal-head">
        <h3>New Conversation</h3>
        <button class="icon-btn" (click)="showModal=false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="modal-search">
        <div class="sb-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            class="sb-search-input"
            type="text"
            [(ngModel)]="modalSearch"
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      <div class="modal-list">
        <div class="loading-row" *ngIf="loadingPeople">
          <div class="mini-spin"></div> Loading people...
        </div>
        <div
          class="chat-row"
          *ngFor="let u of filteredModalPeople"
          (click)="startChat(u); showModal=false"
        >
          <div class="avatar" [style.background]="colorFor(u.name)">
            {{ u.name.charAt(0).toUpperCase() }}
            <div class="green-dot" *ngIf="onlineIds.includes(u._id)"></div>
          </div>
          <div class="chat-row-info">
            <span class="chat-row-name">{{ u.name }}</span>
            <span class="chat-row-preview">{{ u.email }}</span>
          </div>
        </div>
        <div class="empty-hint sm" *ngIf="!loadingPeople && filteredModalPeople.length === 0">
          <p>No users found</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile overlay to close sidebar -->
  <div class="sb-overlay" *ngIf="sidebarOpen" (click)="sidebarOpen=false"></div>
</div>
  `,
  styles: [`

/* ══ SHELL ═══════════════════════════════════════ */
.shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-0);
  position: relative;
}

/* ══ SIDEBAR ═════════════════════════════════════ */
.sidebar {
  width: 300px;
  flex-shrink: 0;
  background: var(--bg-1);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
}
@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    inset: 0 auto 0 0;
    width: 80%;
    max-width: 300px;
    transform: translateX(-100%);
    transition: transform 260ms ease;
    box-shadow: 4px 0 40px rgba(0,0,0,0.5);
  }
  .sidebar.open { transform: translateX(0); }
}

/* Sidebar top bar */
.sb-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px 10px;
  flex-shrink: 0;
}
.sb-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 17px;
  font-weight: 800;
  color: var(--t1);
  letter-spacing: -0.3px;
}

/* Search */
.sb-search-wrap { padding: 0 10px 8px; flex-shrink: 0; }
.sb-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-3);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 0 12px;
  height: 36px;
  transition: border-color 160ms;
}
.sb-search:focus-within { border-color: rgba(37,99,235,0.5); }
.sb-search svg { color: var(--t3); flex-shrink: 0; }
.sb-search-input {
  flex: 1; background: none; border: none; outline: none;
  color: var(--t1); font-size: 13px;
}
.sb-search-input::placeholder { color: var(--t3); }

/* Tabs */
.sb-tabs {
  display: flex;
  padding: 0 10px 6px;
  gap: 4px;
  flex-shrink: 0;
}
.sb-tab {
  flex: 1; height: 30px; background: none; border: none;
  border-radius: 8px; color: var(--t3); font-size: 13px;
  font-weight: 600; cursor: pointer; transition: all 150ms;
}
.sb-tab.active { background: rgba(37,99,235,0.12); color: #60a5fa; }
.sb-tab:hover:not(.active) { background: var(--bg-3); color: var(--t2); }

/* List */
.sb-list { flex: 1; overflow-y: auto; padding: 2px 0; }

/* Chat row */
.chat-row {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 12px;
  cursor: pointer;
  border-radius: 10px;
  margin: 0 6px;
  transition: background 150ms;
}
.chat-row:hover { background: var(--bg-3); }
.chat-row.active { background: rgba(37,99,235,0.1); }
.chat-row.active .chat-row-name { color: #60a5fa; }
.chat-row-info { flex: 1; min-width: 0; }
.chat-row-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.chat-row-name {
  font-size: 14px; font-weight: 600; color: var(--t1);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.chat-row-time { font-size: 11px; color: var(--t3); flex-shrink: 0; }
.chat-row-preview {
  font-size: 12px; color: var(--t2);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.unread-dot {
  background: var(--blue); color: white;
  font-size: 10px; font-weight: 700;
  min-width: 17px; height: 17px;
  border-radius: 99px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px; flex-shrink: 0;
}

/* Avatar */
.avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 700; color: white;
  flex-shrink: 0; position: relative;
}
.avatar.sm { width: 32px; height: 32px; font-size: 12px; }
.avatar.xs { width: 26px; height: 26px; font-size: 10px; margin-bottom: 18px; }
.green-dot {
  position: absolute; bottom: 0; right: 0;
  width: 9px; height: 9px;
  background: #22c55e; border: 2px solid var(--bg-1);
  border-radius: 50%;
}

/* Empty / loading */
.empty-hint {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 40px 20px;
  text-align: center; color: var(--t3); gap: 6px;
}
.empty-hint p { font-size: 14px; font-weight: 600; color: var(--t2); }
.empty-hint span { font-size: 12px; }
.empty-hint.sm { padding: 20px; }
.loading-row {
  display: flex; align-items: center; gap: 10px;
  padding: 14px; color: var(--t2); font-size: 13px;
}
.mini-spin {
  width: 14px; height: 14px;
  border: 2px solid var(--border); border-top-color: var(--blue);
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Sidebar footer */
.sb-footer {
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.sb-profile { display: flex; align-items: center; gap: 9px; }
.sb-profile-name { font-size: 13px; font-weight: 700; color: var(--t1); }
.sb-profile-status { font-size: 11px; color: #22c55e; }

/* Icon button */
.icon-btn {
  width: 32px; height: 32px; background: none; border: none;
  border-radius: 8px; color: var(--t2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 150ms;
}
.icon-btn:hover { background: var(--bg-3); color: var(--t1); }
.icon-btn.red-hover:hover { background: rgba(239,68,68,0.1); color: #f87171; }

/* ══ MAIN ════════════════════════════════════════ */
.main {
  flex: 1; display: flex; flex-direction: column;
  overflow: hidden; min-width: 0;
}

.mobile-topbar {
  display: none; align-items: center; gap: 12px;
  padding: 0 14px; height: 52px;
  background: var(--bg-1); border-bottom: 1px solid var(--border);
  font-size: 15px; font-weight: 700; color: var(--t1);
  flex-shrink: 0;
}
@media (max-width: 768px) { .mobile-topbar { display: flex; } }

/* ══ EMPTY STATE ════════════════════════════════ */
.no-chat {
  flex: 1; display: flex; align-items: center; justify-content: center;
}
.no-chat-box {
  text-align: center; color: var(--t3);
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.no-chat-box svg { margin-bottom: 8px; }
.no-chat-box h3 { font-size: 18px; font-weight: 700; color: var(--t2); }
.no-chat-box p { font-size: 14px; margin-bottom: 8px; }
.start-btn {
  background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.3);
  color: #60a5fa; padding: 9px 20px; border-radius: 99px;
  font-size: 14px; font-weight: 600; cursor: pointer; transition: all 160ms;
}
.start-btn:hover { background: rgba(37,99,235,0.18); }

/* ══ CHAT VIEW ═══════════════════════════════════ */
.chat-view { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* Chat header */
.chat-header {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px;
  background: var(--bg-1); border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.back-btn { display: none; }
@media (max-width: 768px) { .back-btn { display: flex; } }
.header-info { flex: 1; min-width: 0; }
.header-name { font-size: 15px; font-weight: 700; color: var(--t1); display: block; }
.header-status { font-size: 12px; }
.typing-label  { color: #60a5fa; font-style: italic; }
.online-label  { color: #22c55e; }
.offline-label { color: var(--t3); }
.header-actions { display: flex; gap: 2px; }

/* Messages area */
.msgs-area { flex: 1; overflow-y: auto; padding: 0 16px; }
.msgs-inner {
  max-width: 780px; margin: 0 auto;
  padding: 20px 0; display: flex; flex-direction: column; gap: 2px;
}
.msgs-loading {
  display: flex; justify-content: center; padding: 32px;
}
.msgs-empty {
  text-align: center; color: var(--t3);
  padding: 48px; font-size: 14px;
}

/* Date separator */
.date-sep {
  display: flex; align-items: center; gap: 12px;
  margin: 16px 0; color: var(--t3);
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.date-sep::before, .date-sep::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

/* Bubble row */
.bubble-row {
  display: flex; align-items: flex-end; gap: 7px;
  animation: msgIn 200ms ease forwards;
}
.bubble-row.mine { flex-direction: row-reverse; }
@keyframes msgIn {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}

.bubble-wrap { max-width: 65%; display: flex; flex-direction: column; }
.bubble-row.mine .bubble-wrap { align-items: flex-end; }

.sender-name {
  font-size: 11px; font-weight: 600; color: var(--t3);
  margin-bottom: 3px; padding-left: 2px;
}

.bubble {
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: 16px 16px 16px 4px;
  padding: 9px 13px;
  font-size: 14px; line-height: 1.5; color: var(--t1);
  word-break: break-word;
}
.bubble.mine-bubble {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-color: transparent;
  border-radius: 16px 16px 4px 16px;
}
.bubble.deleted { color: var(--t3); font-style: italic; }

.bubble-meta {
  display: flex; align-items: center; gap: 4px;
  margin-top: 3px; padding: 0 3px;
}
.bubble-meta.mine-meta { justify-content: flex-end; }
.msg-time { font-size: 10px; color: var(--t3); }

/* Typing bubble */
.typing-bubble {
  display: flex; gap: 5px; align-items: center;
  padding: 10px 14px;
}
.typing-bubble span {
  display: block; width: 7px; height: 7px;
  background: var(--t2); border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
.typing-bubble span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%,60%,100% { transform:translateY(0); }
  30%         { transform:translateY(-6px); }
}

/* Message input */
.input-area {
  padding: 10px 16px 14px;
  background: var(--bg-1); border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.input-row {
  display: flex; align-items: center; gap: 8px;
  max-width: 780px; margin: 0 auto;
}
.input-box {
  flex: 1;
  background: var(--bg-3); border: 1.5px solid var(--border);
  border-radius: 99px; height: 44px;
  display: flex; align-items: center;
  transition: border-color 180ms, box-shadow 180ms;
}
.input-box.focused {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
}
.msg-input {
  flex: 1; background: none; border: none; outline: none;
  color: var(--t1); font-size: 14px; padding: 0 16px; height: 100%;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.msg-input::placeholder { color: var(--t3); }
.send-btn {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--blue); border: none; color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: all 180ms; box-shadow: 0 2px 10px rgba(37,99,235,0.4);
}
.send-btn:hover:not(:disabled) { background: #1d4ed8; transform: scale(1.06); }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

/* ══ MODAL ═══════════════════════════════════════ */
.backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 200;
}
.modal {
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: 18px; width: 90%; max-width: 400px;
  max-height: 65vh; display: flex; flex-direction: column;
  overflow: hidden; animation: fadeUp 200ms ease forwards;
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}
.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 16px 10px; border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.modal-head h3 { font-size: 15px; font-weight: 700; color: var(--t1); }
.modal-search { padding: 10px 14px; flex-shrink: 0; }
.modal-list { flex: 1; overflow-y: auto; padding: 4px 0 8px; }

/* Mobile sidebar overlay */
.sb-overlay {
  display: none;
  position: fixed; inset: 0; z-index: 9;
  background: rgba(0,0,0,0.4);
}
@media (max-width: 768px) { .sb-overlay { display: block; } }

  `],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollEl') scrollEl!: ElementRef
  @ViewChild('anchor')   anchor!:   ElementRef

  private destroy$ = new Subject<void>()

  me: User | null = null

  // Data
  chats:    Chat[]    = []
  messages: Message[] = []
  people:   User[]    = []

  // Active state
  activeChat: Chat | null = null
  onlineIds:  string[]    = []
  typingUsers: string[]   = []

  // UI state
  tab          = 'chats'
  searchQ      = ''
  modalSearch  = ''
  msgText      = ''
  inputFocused = false
  sending      = false
  sidebarOpen  = false
  showModal    = false
  loadingPeople = false
  loadingMsgs   = false
  shouldScroll  = false

  private typingTimer: ReturnType<typeof setTimeout> | null = null

  constructor(
    private auth:   AuthService,
    private socket: SocketService,
    private chatSvc: ChatService,
  ) {}

  ngOnInit() {
    this.me = this.auth.currentUser$()
    this.loadChats()
    this.setupSocket()
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom()
      this.shouldScroll = false
    }
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    if (this.activeChat) this.socket.leaveChat(this.activeChat._id)
  }

  // ── Load chats list ────────────────────────────────────────
  loadChats() {
    this.chatSvc.getChats().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => { this.chats = res.data || [] },
    })
  }

  // ── Open a chat and load its messages ─────────────────────
  openChat(chat: Chat) {
    if (this.activeChat) this.socket.leaveChat(this.activeChat._id)
    this.activeChat  = chat
    this.messages    = []
    this.typingUsers = []
    this.sidebarOpen = false
    this.socket.joinChat(chat._id)
    this.loadMessages(chat._id)
    // Mark messages as read
    this.chatSvc.markAsRead(chat._id).pipe(takeUntil(this.destroy$)).subscribe()
  }

  // ── Load messages ──────────────────────────────────────────
  loadMessages(chatId: string) {
    this.loadingMsgs = true
    this.chatSvc.getMessages(chatId).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.messages    = res.data || []
        this.loadingMsgs = false
        this.shouldScroll = true
      },
      error: () => { this.loadingMsgs = false },
    })
  }

  // ── Send a message ─────────────────────────────────────────
  send() {
    const text = this.msgText.trim()
    if (!text || !this.activeChat || this.sending) return
    this.sending = true
    this.msgText = ''

    this.chatSvc.sendMessage(this.activeChat._id, text).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        // Add to messages list
        this.messages.push(res.data)
        this.shouldScroll = true
        this.sending = false
        // Update sidebar preview
        const c = this.chats.find(c => c._id === this.activeChat?._id)
        if (c) { c.lastMessageText = text; c.lastActivity = new Date().toISOString() }
      },
      error: () => {
        this.msgText  = text  // put text back if failed
        this.sending = false
      },
    })
  }

  // ── Start a direct chat with a user ───────────────────────
  startChat(user: User) {
    this.chatSvc.createOrGetDirectChat(user._id).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        const chat = res.data
        // Add to sidebar if not already there
        if (!this.chats.find(c => c._id === chat._id)) this.chats.unshift(chat)
        this.openChat(chat)
        this.tab = 'chats'
      },
    })
  }

  // ── Typing indicator ───────────────────────────────────────
  onTyping() {
    if (!this.activeChat || !this.me) return
    this.socket.sendTypingStart(this.activeChat._id, this.me._id, this.me.name)
    if (this.typingTimer) clearTimeout(this.typingTimer)
    this.typingTimer = setTimeout(() => {
      if (this.activeChat && this.me)
        this.socket.sendTypingStop(this.activeChat._id, this.me._id)
    }, 1500)
  }

  // ── Switch to People tab ───────────────────────────────────
  switchToPeople() {
    this.tab = 'people'
    if (this.people.length === 0) this.fetchPeople()
  }

  openNewChatModal() {
    this.showModal = true
    if (this.people.length === 0) this.fetchPeople()
  }

  fetchPeople() {
    this.loadingPeople = true
    this.chatSvc.getUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => { this.people = res.data || []; this.loadingPeople = false },
      error: () => { this.loadingPeople = false },
    })
  }

  // ── Socket setup ───────────────────────────────────────────
  setupSocket() {
    // Online users list
    this.socket.on<string[]>('users:online-list')
      .pipe(takeUntil(this.destroy$))
      .subscribe(ids => { this.onlineIds = ids })

    // Incoming message from another user via socket
    this.socket.on<Message>('message:received')
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        // Only add if not already in messages (avoid duplicate with sendMessage API response)
        if (this.activeChat && msg.chat === this.activeChat._id) {
          const exists = this.messages.find(m => m._id === msg._id)
          if (!exists) {
            this.messages.push(msg)
            this.shouldScroll = true
          }
        }
        // Update sidebar preview
        const c = this.chats.find(c => c._id === msg.chat)
        if (c) { c.lastMessageText = msg.content; c.lastActivity = msg.createdAt }
      })

    // Message deleted
    this.socket.on<{ messageId: string }>('message:deleted')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ messageId }) => {
        const msg = this.messages.find(m => m._id === messageId)
        if (msg) { msg.isDeleted = true; msg.content = 'This message was deleted' }
      })

    // Typing started
    this.socket.on<{ userId: string }>('typing:started')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ userId }) => {
        if (userId !== this.me?._id && !this.typingUsers.includes(userId))
          this.typingUsers.push(userId)
      })

    // Typing stopped
    this.socket.on<{ userId: string }>('typing:stopped')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ userId }) => {
        this.typingUsers = this.typingUsers.filter(id => id !== userId)
      })
  }

  // ── Helpers ────────────────────────────────────────────────

  getChatName(chat: Chat): string {
    if (chat.type === 'group') return chat.name || 'Group Chat'
    const other = chat.participants?.find(p => p.user?._id !== this.me?._id)
    return other?.user?.name || 'Unknown'
  }

  isOnline(chat: Chat): boolean {
    if (chat.type === 'group') return false
    const other = chat.participants?.find(p => p.user?._id !== this.me?._id)
    return other ? this.onlineIds.includes(other.user?._id) : false
  }

  isMine(msg: Message): boolean {
    const senderId = (msg.sender as User)?._id ?? msg.sender
    return senderId === this.me?._id
  }

  get filteredChats(): Chat[] {
    if (!this.searchQ) return this.chats
    const q = this.searchQ.toLowerCase()
    return this.chats.filter(c => this.getChatName(c).toLowerCase().includes(q))
  }

  get filteredPeople(): User[] {
    if (!this.searchQ) return this.people
    const q = this.searchQ.toLowerCase()
    return this.people.filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }

  get filteredModalPeople(): User[] {
    if (!this.modalSearch) return this.people
    const q = this.modalSearch.toLowerCase()
    return this.people.filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }

  colorFor(name: string): string {
    const palette = ['#2563eb','#7c3aed','#db2777','#ea580c','#16a34a','#0891b2','#9333ea','#0f766e']
    let h = 0
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
    return palette[Math.abs(h) % palette.length]
  }

  showDateSep(i: number): boolean {
    if (i === 0) return true
    const a = new Date(this.messages[i - 1].createdAt).toDateString()
    const b = new Date(this.messages[i].createdAt).toDateString()
    return a !== b
  }

  formatDate(d: string): string {
    const date = new Date(d)
    const today     = new Date()
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === today.toDateString())     return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString([], { weekday:'long', month:'short', day:'numeric' })
  }

  formatTime(d: string): string {
    return new Date(d).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
  }

  ago(d: string): string {
    if (!d) return ''
    const date = new Date(d)
    const now   = new Date()
    const diff  = Math.floor((now.getTime() - date.getTime()) / 86400000)
    if (diff === 0) return date.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    if (diff === 1) return 'Yesterday'
    if (diff < 7)   return date.toLocaleDateString([], { weekday:'short' })
    return date.toLocaleDateString([], { day:'numeric', month:'short' })
  }

  scrollToBottom() {
    try {
      const el = this.scrollEl?.nativeElement
      if (el) el.scrollTop = el.scrollHeight
    } catch {}
  }

  logout() { this.auth.logout() }
}