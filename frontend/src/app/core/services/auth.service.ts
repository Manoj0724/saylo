import { Injectable, signal, computed } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { Observable, tap, catchError, throwError } from 'rxjs'
import { environment } from '../../../environments/environment'
import { SocketService } from './socket.service'

export interface User {
  _id: string; name: string; email: string;
  avatar: string | null; bio: string; status: string;
  lastSeen: string; isVerified: boolean; createdAt: string;
}
export interface AuthData { user: User; accessToken: string; refreshToken: string; }
export interface AuthResponse { success: boolean; message: string; data: AuthData; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`

  private _user    = signal<User | null>(this.loadUser())
  private _loading = signal<boolean>(false)

  // Both names work: currentUser$() and currentUser()
  readonly currentUser$ = this._user.asReadonly()
  readonly currentUser  = this._user.asReadonly()

  readonly isLoading$ = this._loading.asReadonly()
  readonly isLoggedIn = computed(() => !!this._user())

  constructor(
    private http:   HttpClient,
    private router: Router,
    private socket: SocketService,
  ) {}

  register(data: { name: string; email: string; password: string; phone?: string }): Observable<AuthResponse> {
    this._loading.set(true)
    return this.http.post<AuthResponse>(`${this.API}/register`, data).pipe(
      tap((res: AuthResponse) => this.onSuccess(res)),
      catchError((err: unknown) => { this._loading.set(false); return throwError(() => err) })
    )
  }

  login(email: string, password: string): Observable<AuthResponse> {
    this._loading.set(true)
    return this.http.post<AuthResponse>(`${this.API}/login`, { email, password }).pipe(
      tap((res: AuthResponse) => this.onSuccess(res)),
      catchError((err: unknown) => { this._loading.set(false); return throwError(() => err) })
    )
  }

  logout(): void {
    this.http.post(`${this.API}/logout`, {}).subscribe({
      complete: () => this.clear(),
      error:    () => this.clear(),
    })
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/refresh`, { refreshToken: this.getRefreshToken() }).pipe(
      tap((res: AuthResponse) => {
        localStorage.setItem('saylo_access_token',  res.data.accessToken)
        localStorage.setItem('saylo_refresh_token', res.data.refreshToken)
      }),
      catchError((err: unknown) => { this.clear(); return throwError(() => err) })
    )
  }

  getAccessToken():  string | null { return localStorage.getItem('saylo_access_token') }
  getRefreshToken(): string | null { return localStorage.getItem('saylo_refresh_token') }

  isTokenExpired(): boolean {
    const token = this.getAccessToken()
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number }
      return payload.exp * 1000 < Date.now()
    } catch { return true }
  }

  private onSuccess(res: AuthResponse): void {
    const { user, accessToken, refreshToken } = res.data
    localStorage.setItem('saylo_access_token',  accessToken)
    localStorage.setItem('saylo_refresh_token', refreshToken)
    localStorage.setItem('saylo_user', JSON.stringify(user))
    this._user.set(user)
    this.socket.connect(user._id)
    this._loading.set(false)
    void this.router.navigate(['/chats'])
  }

  private clear(): void {
    localStorage.removeItem('saylo_access_token')
    localStorage.removeItem('saylo_refresh_token')
    localStorage.removeItem('saylo_user')
    this._user.set(null)
    this.socket.disconnect()
    void this.router.navigate(['/auth/login'])
  }

  private loadUser(): User | null {
    try {
      const u = localStorage.getItem('saylo_user')
      return u ? (JSON.parse(u) as User) : null
    } catch { return null }
  }
}