import { t, getLocale } from '../i18n/language'
export const number = (value: number) => new Intl.NumberFormat(getLocale(), { maximumFractionDigits: 4 }).format(value)
export function dateTime(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? t('Unknown date') : new Intl.DateTimeFormat(getLocale(), { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function movementName(value: string): string {
  const labels: Record<string, string> = { '1': 'Stock in', '2': 'Stock out', '3': 'Transfer in', '4': 'Transfer out', '5': 'Adjustment', StockIn: 'Stock in', StockOut: 'Stock out', TransferIn: 'Transfer in', TransferOut: 'Transfer out', Adjustment: 'Adjustment' }
  return t(labels[value] ?? value)
}
