import { Component, signal } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthService } from '../../../core/services/auth.service'
import { MatSnackBarModule } from '@angular/material/snack-bar'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatSnackBarModule],
  template: `
    <div class="auth-shell">
      <!-- Background atmosphere -->
      <div class="auth-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="grid-overlay"></div>
      </div>

      <div class="auth-card animate-scale-in">
        <!-- Logo -->
        <div class="auth-logo">
          <div class="logo-mark">S</div>
          <span class="logo-text gradient-text">Saylo</span>
        </div>

        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-subtitle">Sign in to continue your conversations</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" novalidate>

          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-wrap" [class.error]="isInvalid('email')" [class.focused]="focusState['email']">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input
                type="email"
                formControlName="email"
                placeholder="you@example.com"
                autocomplete="email"
                (focus)="focusState['email']=true"
                (blur)="focusState['email']=false"
              >
            </div>
            @if (isInvalid('email')) {
              <span class="form-error">{{ getError('email') }}</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrap" [class.error]="isInvalid('password')" [class.focused]="focusState['password']">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="current-password"
                (focus)="focusState['password']=true"
                (blur)="focusState['password']=false"
              >
              <button type="button" class="toggle-password" (click)="showPassword.set(!showPassword())">
                @if (showPassword()) {
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                } @else {
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            @if (isInvalid('password')) {
              <span class="form-error">{{ getError('password') }}</span>
            }
          </div>

          @if (serverError()) {
            <div class="server-error animate-fade-in">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ serverError() }}
            </div>
          }

          <button type="submit" class="saylo-btn-primary submit-btn" [disabled]="loading()">
            @if (loading()) {
              <span class="btn-spinner"></span> Signing in...
            } @else {
              Sign in
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            }
          </button>
        </form>

        <div class="auth-footer">
          Don't have an account?
          <a routerLink="/auth/register" class="auth-link">Create one</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-void);
      position: relative;
      overflow: hidden;
    }

    .auth-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.6;
    }

    .orb-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(108,99,255,0.25) 0%, transparent 70%);
      top: -150px; left: -100px;
    }

    .orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%);
      bottom: -100px; right: -80px;
    }

    .orb-3 {
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(255,107,157,0.10) 0%, transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }

    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .auth-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: 40px;
      box-shadow: var(--shadow-lg), var(--shadow-glow);
    }

    .auth-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 28px;
    }

    .logo-mark {
      width: 42px; height: 42px;
      background: var(--grad-cyber);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display);
      font-weight: 800; font-size: 18px;
      color: white;
      box-shadow: 0 4px 16px rgba(108,99,255,0.4);
    }

    .logo-text {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .auth-title {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }

    .auth-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 28px;
    }

    .auth-form { display: flex; flex-direction: column; gap: 16px; }

    .form-group { display: flex; flex-direction: column; gap: 6px; }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      letter-spacing: 0.2px;
    }

    .input-wrap {
      display: flex;
      align-items: center;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0 14px;
      transition: var(--transition-fast);
      gap: 10px;

      &.focused { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(108,99,255,0.12); }
      &.error { border-color: var(--accent-red); }
    }

    .input-icon { color: var(--text-muted); display: flex; flex-shrink: 0; }

    .input-wrap input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      padding: 13px 0;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 14px;

      &::placeholder { color: var(--text-muted); }
    }

    .toggle-password {
      background: none; border: none; cursor: pointer;
      color: var(--text-muted); display: flex; padding: 0;
      transition: color 0.15s;
      &:hover { color: var(--text-secondary); }
    }

    .form-error { font-size: 12px; color: var(--accent-red); }

    .server-error {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px;
      background: rgba(255,107,107,0.08);
      border: 1px solid rgba(255,107,107,0.2);
      border-radius: var(--radius-md);
      font-size: 13px;
      color: var(--accent-red);
    }

    .submit-btn {
      width: 100%;
      padding: 14px;
      margin-top: 4px;
      font-size: 15px;
    }

    .btn-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 13.5px;
      color: var(--text-muted);
    }

    .auth-link {
      color: var(--accent-primary);
      font-weight: 600;
      text-decoration: none;
      margin-left: 4px;
      &:hover { text-decoration: underline; }
    }
  `],
})
export class LoginComponent {
  form: FormGroup
  loading    = signal(false)
  showPassword = signal(false)
  serverError  = signal('')
  focusState: Record<string, boolean> = {}

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

 onSubmit(): void {
  if (this.form.invalid) { this.form.markAllAsTouched(); return }

  this.loading.set(true)
  this.serverError.set('')

  const { email, password } = this.form.value

  this.auth.login(email, password).subscribe({
    next: () => {
      this.snack.open('Welcome back to Saylo! 👋', '✕')
      this.loading.set(false)
      this.router.navigate(['/chat'])   // ← ADD THIS
    },
    error: (err) => {
      this.serverError.set(err.error?.message || 'Login failed. Try again.')
      this.loading.set(false)
    },
  })
}
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field)
    return !!(ctrl?.invalid && ctrl?.touched)
  }

  getError(field: string): string {
    const ctrl = this.form.get(field)
    if (ctrl?.errors?.['required']) return 'This field is required'
    if (ctrl?.errors?.['email'])    return 'Enter a valid email address'
    if (ctrl?.errors?.['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters`
    return ''
  }
}