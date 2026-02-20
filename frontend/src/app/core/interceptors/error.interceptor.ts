import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { catchError, throwError } from 'rxjs'

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const snackBar = inject(MatSnackBar)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('saylo_token')
        localStorage.removeItem('saylo_user')
        router.navigate(['/auth/login'])
      } else if (error.status === 0) {
        snackBar.open('Connection lost. Check your network.', '✕', { duration: 5000 })
      } else if (error.status >= 500) {
        snackBar.open('Server error. Please try again.', '✕', { duration: 4000 })
      }
      return throwError(() => error)
    })
  )
}