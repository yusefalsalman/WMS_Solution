import { Languages } from 'lucide-react'
import { setLanguage, useLanguage } from './language'

export function LanguageSwitcher() {
  const language = useLanguage()
  return <button type="button" lang={language === 'ar' ? 'en' : 'ar'} onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 font-sans text-xs font-medium text-ink hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><Languages size={16} aria-hidden="true" />{language === 'ar' ? 'English' : 'العربية'}</button>
}
