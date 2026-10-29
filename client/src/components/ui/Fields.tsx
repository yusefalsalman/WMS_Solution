import { t, useLanguage } from '../../i18n/language'
import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const control = 'w-full min-h-11 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-[#6c865b] focus:ring-3 focus:ring-[#6c865b]/10 disabled:bg-surface disabled:text-muted'

export function Input({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  useLanguage()
  const id = useId()
  return <div><label htmlFor={id} className="mb-2 block text-xs font-semibold">{t(label)}</label><input id={id} className={control} aria-describedby={hint ? `${id}-hint` : undefined} {...props} />{hint && <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-muted">{hint && t(hint)}</p>}</div>
}

export function Select({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  useLanguage()
  const id = useId()
  return <div><label htmlFor={id} className="mb-2 block text-xs font-semibold">{t(label)}</label><select id={id} className={control} {...props}>{children}</select></div>
}

export function TextArea({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  useLanguage()
  const id = useId()
  return <div><label htmlFor={id} className="mb-2 block text-xs font-semibold">{t(label)}</label><textarea id={id} className={control} rows={3} {...props} /></div>
}
