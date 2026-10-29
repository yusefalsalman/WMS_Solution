import { t, useLanguage } from '../../i18n/language'
import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button, Notice } from './Ui'
import { useMutation } from '../../hooks/useMutation'

export function Modal({ title, description, children, onClose, busy = false }: { title: string; description?: string; children: ReactNode; onClose: () => void; busy?: boolean }) {
  useLanguage()
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  useEffect(() => {
    const dialog = ref.current!
    const focused = document.activeElement as HTMLElement | null
    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; focused?.focus() }
  }, [])
  return <dialog ref={ref} aria-labelledby={id} aria-describedby={description ? `${id}-description` : undefined} onCancel={event => { event.preventDefault(); if (!busy) onClose() }} className="fixed inset-0 m-auto max-h-[90svh] w-[calc(100%-32px)] max-w-lg overflow-y-auto rounded-2xl border border-border bg-[#fcfcf8] p-0 text-ink shadow-2xl backdrop:bg-[#112719]/45 backdrop:backdrop-blur-sm"><header className="flex items-start justify-between gap-4 border-b border-border p-6"><div><h2 id={id} className="text-xl font-semibold tracking-tight">{t(title)}</h2>{description && <p id={`${id}-description`} className="mt-2 text-sm leading-relaxed text-muted">{description && t(description)}</p>}</div><button type="button" aria-label={t("Close dialog")} disabled={busy} onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface focus-visible:outline-2 disabled:opacity-30"><X size={20} /></button></header><div className="p-6">{children}</div></dialog>
}

export function DeleteDialog({ title, description, remove, onClose, onSuccess }: { title: string; description: string; remove: () => Promise<void>; onClose: () => void; onSuccess: () => void }) {
  useLanguage()
  const mutation = useMutation()
  return <Modal title={t(title)} description={description && t(description)} busy={mutation.pending} onClose={onClose}><div className="space-y-5">{mutation.error && <Notice>{mutation.error}</Notice>}<div className="flex justify-end gap-3"><Button variant="secondary" disabled={mutation.pending} onClick={onClose}>{t("Cancel")}</Button><Button variant="danger" disabled={mutation.pending} onClick={() => mutation.run(remove, onSuccess)}>{mutation.pending ? t("Deleting…") : t("Confirm delete")}</Button></div></div></Modal>
}
