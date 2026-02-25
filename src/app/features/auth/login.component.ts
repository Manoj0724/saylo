import { Component, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../core/services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="auth-shell">
  <div class="auth-card">
    <div class="auth-logo">S</div>
    <h1 class="auth-title">Welcome back</h1>
    <p class="auth-sub">Sign in to Saylo</p>

    @if(error()){
      <div class="auth-error">{{error()}}</div>
    }

    <div class="auth-form">
      <div class="field">
        <label>Email</label>
        <input type="email" [(ngModel)]="email" placeholder="you@example.com" (keydown.enter)="login()">
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" [(ngModel)]="password" placeholder="••••••••" (keydown.enter)="login()">
      </div>
      <button class="auth-btn" [class.loading]="loading()" (click)="login()" [disabled]="loading()">
        @if(loading()){ <span class="spinner"></span> } @else { Sign In }
      </button>
    </div>

    <p class="auth-link">No account? <a routerLink="/register">Create one</a></p>
  </div>
</div>
  `,
  styles: [`
    .auth-shell {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #f8f4f0 0%, #ede8ff 100%);
      padding: 20px;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .auth-card {
      background: #fff; border-radius: 24px; padding: 40px;
      width: 100%; max-width: 400px;
      box-shadow: 0 8px 40px rgba(0,0,0,.10); text-align: center;
    }
    .auth-logo {
      width: 56px; height: 56px;
      background: linear-gradient(135deg, #6C63FF, #F5A623);
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 800; color: #fff;
      margin: 0 auto 20px;
      box-shadow: 0 4px 16px rgba(108,99,255,.3);
    }
    .auth-title { font-size: 26px; font-weight: 800; color: #1a1410; margin: 0 0 6px; }
    .auth-sub { color: #9c8f85; font-size: 14px; margin: 0 0 28px; }
    .auth-error {
      background: #fff0f0; border: 1px solid #fcc; border-radius: 10px;
      padding: 10px 14px; color: #e53; font-size: 13px; margin-bottom: 16px;
    }
    .auth-form { text-align: left; display: flex; flex-direction: column; gap: 16px; }
    .field label { display: block; font-size: 13px; font-weight: 600; color: #4a3f35; margin-bottom: 6px; }
    .field input {
      width: 100%; padding: 12px 14px;
      border: 1.5px solid #e8e1d9; border-radius: 12px;
      font-size: 15px; color: #1a1410;
      transition: border-color .15s; outline: none; box-sizing: border-box;
    }
    .field input:focus { border-color: #6C63FF; }
    .auth-btn {
      width: 100%; padding: 14px;
      background: linear-gradient(135deg, #6C63FF, #F5A623);
      color: #fff; border: none; border-radius: 14px;
      font-size: 15px; font-weight: 700; cursor: pointer;
      transition: all .2s; margin-top: 4px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 50px;
    }
    .auth-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(108,99,255,.35); }
    .auth-btn:disabled { opacity: .7; cursor: not-allowed; }
    .spinner {
      width: 18px; height: 18px;
      border: 2.5px solid rgba(255,255,255,.4);
      border-top-color: #fff; border-radius: 50%;
      animation: spin .7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-link { margin-top: 20px; color: #9c8f85; font-size: 14px; }
    .auth-link a { color: #6C63FF; font-weight: 600; text-decoration: none; }
    @media(max-width:480px) { .auth-card { padding: 28px 20px; } }
  `]
})
export class LoginComponent {
  email    = ''
  password = ''
  loading  = signal(false)
  error    = signal('')

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) { this.error.set('Please fill all fields'); return }
    this.loading.set(true)
    this.error.set('')
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false)
        this.router.navigate(['/chat'])
      },
      error: (e) => {
        this.error.set(e.error?.message || 'Login failed')
        this.loading.set(false)
      }
    })
  }
}
