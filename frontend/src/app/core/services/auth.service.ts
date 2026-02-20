import { Injectable, signal, computed } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { tap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'

export interface User {
  _id: string
  name: string
  email: string
  avatar: string | null
  bio: string
  status: 'online' | 'offline' | 'busy' | 'away'
  lastSeen: string
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: { user: User; token: string }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'saylo_token'
  private readonly USER_KEY  = 'saylo_user'
  private readonly api = `${environment.apiUrl}/auth`

  // Reactive state using signals
  currentUser = signal<User | null>(this.loadUser())
  isLoggedIn  = computed(() => !!this.currentUser() && !!this.getToken())

  constructor(private http: HttpClient, private router: Router) {}

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, { name, email, password }).pipe(
      tap((res) => this.storeSession(res))
    )
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password }).pipe(
      tap((res) => this.storeSession(res))
    )
  }

  logout(): void {
    this.http.post(`${this.api}/logout`, {}).subscribe()
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    this.currentUser.set(null)
    this.router.navigate(['/auth/login'])
  }

  getMe(): Observable<{ success: boolean; data: { user: User } }> {
    return this.http.get<{ success: boolean; data: { user: User } }>(`${this.api}/me`).pipe(
      tap((res) => {
        this.currentUser.set(res.data.user)
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user))
      })
    )
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  getUserId(): string | null {
    return this.currentUser()?._id ?? null
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.data.token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user))
    this.currentUser.set(res.data.user)
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }
}