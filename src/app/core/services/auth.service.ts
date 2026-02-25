import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { Router } from '@angular/router'

export interface User {
  _id: string
  name: string
  email: string
  avatar: string | null
  status: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'http://172.31.58.150:5001/api/auth'

  // ✅ currentUser signal - required by chat.component.ts
  currentUser = signal<User | null>(this.loadUser())

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem('saylo_user')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, credentials).pipe(
      tap((res) => {
        console.log('✅ FULL LOGIN RESPONSE:', JSON.stringify(res))

        // ✅ handles both token field names: accessToken OR token
        const token = res?.data?.accessToken || res?.data?.token || res?.token || res?.accessToken

        if (token) {
          localStorage.setItem('saylo_token', token)
          localStorage.setItem('saylo_user', JSON.stringify(res.data.user))
          this.currentUser.set(res.data.user)
          console.log('✅ TOKEN SAVED:', token.slice(0, 30) + '...')
        } else {
          console.error('❌ TOKEN NOT FOUND. Full response:', res)
        }
      })
    )
  }

  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/register`, data).pipe(
      tap((res) => {
        const token = res?.data?.accessToken || res?.data?.token || res?.token
        if (token) {
          localStorage.setItem('saylo_token', token)
          localStorage.setItem('saylo_user', JSON.stringify(res.data.user))
          this.currentUser.set(res.data.user)
        }
      })
    )
  }

  logout() {
    localStorage.removeItem('saylo_token')
    localStorage.removeItem('saylo_user')
    this.currentUser.set(null)
    this.router.navigate(['/login'])
  }

  getToken(): string | null {
    return localStorage.getItem('saylo_token')
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }
}
