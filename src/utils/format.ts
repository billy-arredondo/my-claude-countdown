export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function formatWeeklyTime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hrs = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (seconds >= 2 * 86400) return `${days}d ${String(hrs).padStart(2, '0')}h`
  if (seconds >= 3600) {
    if (days > 0) return `${days}d ${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`
    return `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function formatResetLabel(resetAt: number): string {
  const d = new Date(resetAt)
  const hour = d.getHours()
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 || 12
  return `${DAY_NAMES[d.getDay()]} ${h}:${String(d.getMinutes()).padStart(2, '0')} ${ampm}`
}
