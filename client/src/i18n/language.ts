import { useSyncExternalStore } from 'react'
import { ar } from './messages'

export type Language = 'en' | 'ar'
const listeners = new Set<() => void>()
function storedLanguage(): Language {
  try { return localStorage.getItem('wms.language') === 'ar' ? 'ar' : 'en' } catch { return 'en' }
}
let language: Language = storedLanguage()
function applyLanguage() {
  document.documentElement.lang = language
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  document.title = language === 'ar' ? 'WMS | إدارة المستودعات' : 'WMS | Warehouse management'
}
applyLanguage()
export function setLanguage(value: Language) {
  language = value
  try { localStorage.setItem('wms.language', value) } catch { /* Storage may be disabled. */ }
  applyLanguage()
  listeners.forEach(listener => listener())
}
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
export function useLanguage() { return useSyncExternalStore(subscribe, () => language, () => 'en' as Language) }
export function getLocale() { return language === 'ar' ? 'ar-JO' : 'en' }
export function t(message: string): string {
  if (language !== 'ar') return message
  if (ar[message]) return ar[message]
  const stock = /^Insufficient stock available\. Requested: (.+), Available: (.+)$/.exec(message)
  if (stock) return `المخزون غير كافٍ. المطلوب: ${stock[1]}، المتوفر: ${stock[2]}`
  // FluentValidation can return several sentences in one response.
  return message.split(/(?<=\.)\s+/).map(sentence => ar[sentence] ?? sentence).join(' ')
}
window.addEventListener('storage', event => {
  if (event.key === 'wms.language' || event.key === null) setLanguage(storedLanguage())
})
