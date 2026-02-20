import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'timeAgo', standalone: true, pure: false })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return ''
    const now  = new Date()
    const date = new Date(value)
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60)     return 'now'
    if (diff < 3600)   return `${Math.floor(diff / 60)}m`
    if (diff < 86400)  return `${Math.floor(diff / 3600)}h`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`

    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }
}