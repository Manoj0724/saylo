import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `]
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.requestNotificationPermission()
    this.lockOrientation()
  }

  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      // Don't ask immediately — wait for user interaction
      setTimeout(async () => {
        try {
          const result = await Notification.requestPermission()
          console.log('[PWA] Notification permission:', result)
        } catch (err) {
          console.warn('[PWA] Notification permission error:', err)
        }
      }, 5000)
    }
  }

  private lockOrientation(): void {
    // On mobile, lock to portrait by default
    try {
      const screen = window.screen as any
      if (screen?.orientation?.lock) {
        screen.orientation.lock('portrait').catch(() => {
          // Not supported or not in fullscreen — ignore
        })
      }
    } catch {}
  }
}