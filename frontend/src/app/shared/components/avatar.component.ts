import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.background]="gradient"
      [style.borderRadius.px]="rounded ? size : size * 0.3"
      [style.fontSize.px]="size * 0.35">
      {{ initials }}
      @if (showStatus) {
        <span class="status-dot"
          [class]="status"
          [style.width.px]="size * 0.28"
          [style.height.px]="size * 0.28"
          [style.borderWidth.px]="size * 0.06">
        </span>
      }
    </div>
  `,
  styles: [`
    .avatar {
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-weight: 700;
      color: white; flex-shrink: 0; position: relative;
      user-select: none;
    }
    .status-dot {
      position: absolute; bottom: 0; right: 0;
      border-radius: 50%; border-style: solid; border-color: var(--bg-surface);
      &.online  { background: var(--accent-green); }
      &.offline { background: var(--text-muted); }
      &.busy    { background: var(--accent-red); }
      &.away    { background: var(--accent-amber); }
    }
  `]
})
export class AvatarComponent {
  @Input() name   = ''
  @Input() size   = 40
  @Input() status = 'offline'
  @Input() showStatus = false
  @Input() rounded = true  // true = circle, false = rounded square

  get initials(): string {
    return this.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  get gradient(): string {
    const colors = [
      'linear-gradient(135deg,#6C63FF,#00D4FF)',
      'linear-gradient(135deg,#FF6B9D,#FFB800)',
      'linear-gradient(135deg,#00E5A0,#00D4FF)',
      'linear-gradient(135deg,#FFB800,#FF6B9D)',
      'linear-gradient(135deg,#8B5CF6,#EC4899)',
      'linear-gradient(135deg,#10B981,#3B82F6)',
    ]
    let hash = 0
    for (const ch of this.name) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }
}