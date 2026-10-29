import { t, useLanguage } from '../i18n/language'
import { useCallback, useMemo, useState } from 'react'
import type { SubmitEvent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useSearchParams } from 'react-router'
import { ArrowDownLeft, ArrowUpRight, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { adjustStock, getInventory, stockIn, stockOut } from '../services/inventoryService'
import { getReferenceData } from '../services/referenceService'
import type { InventoryItemResponse } from '../types/inventory'
import { number } from '../lib/format'
import { DataTable } from '../components/ui/DataTable'
import { Badge, Button, LoadError, Loading, Notice, PageHeading } from '../components/ui/Ui'
import { Input, TextArea } from '../components/ui/Fields'
import { Modal } from '../components/ui/Modal'
import { ProductSelect, WarehouseSelect } from '../components/ui/ReferenceSelects'
import type { References } from '../components/ui/ReferenceSelects'

type Movement = 'in' | 'out' | 'adjust'
const titles: Record<Movement, string> = { in: 'Receive stock', out: 'Issue stock', adjust: 'Adjust stock balance' }

function MovementForm({ mode, references, initialProduct, initialWarehouse, onClose, onSaved }: { mode: Movement; references: References; initialProduct: string; initialWarehouse: string; onClose: () => void; onSaved: () => void }) {
  useLanguage()
  const [productId, setProductId] = useState(initialProduct)
  const [warehouseId, setWarehouseId] = useState(initialWarehouse)
  const [validation, setValidation] = useState('')
  const mutation = useMutation()
  const loadBalance = useCallback(() => productId && warehouseId ? getInventory({ productId, warehouseId }) : Promise.resolve([]), [productId, warehouseId])
  const balance = useAsync(loadBalance)
  const unit = references.products.find(product => product.id === productId)?.unitOfMeasure
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const quantity = Number(form.get('quantity'))
    const reason = String(form.get('reason')).trim()
    if (!Number.isFinite(quantity) || (mode === 'adjust' ? quantity < 0 : quantity <= 0)) { setValidation('Enter a valid quantity. Stock movements must be greater than zero.'); return }
    if (mode === 'adjust' && !reason) { setValidation('Tell us why the stock balance is being adjusted.'); return }
    setValidation('')
    void mutation.run(() => mode === 'adjust' ? adjustStock({ productId, warehouseId, newQuantity: quantity, reason }) : (mode === 'in' ? stockIn : stockOut)({ productId, warehouseId, quantity, reason: reason || null }), onSaved)
  }
  return <Modal title={titles[mode]} description={mode === 'adjust' ? t("Set the counted balance. This replaces the current quantity and records the reason.") : t("Every movement is recorded with your user account in the activity log.")} busy={mutation.pending} onClose={onClose}><form className="space-y-5" onSubmit={submit}><ProductSelect products={references.products} value={productId} onChange={setProductId} disabled={mutation.pending} /><WarehouseSelect warehouses={references.warehouses} value={warehouseId} onChange={setWarehouseId} disabled={mutation.pending} />{productId && warehouseId && <div className="rounded-lg border border-border bg-surface px-4 py-3 text-xs text-muted">{balance.loading ? t("Checking current stock…") : balance.error ? <span role="alert">{t("Current balance unavailable. The server will validate this movement.")}</span> : <>{t("Current balance:")} <strong className="ms-1 text-ink">{number(balance.data?.[0]?.quantity ?? 0)} {unit ? t(unit) : ""}</strong></>}</div>}<Input label={mode === 'adjust' ? t("New total quantity") : t("Quantity")} name="quantity" type="number" min="0" step="any" required disabled={mutation.pending} placeholder="0" hint={mode === 'out' ? t("The warehouse must have enough stock to cover this amount.") : undefined} /><TextArea label={mode === 'adjust' ? t("Reason (required)") : t("Reason (optional)")} name="reason" required={mode === 'adjust'} maxLength={500} disabled={mutation.pending} placeholder={t("Add a note about this movement")} />{(validation || mutation.error) && <Notice>{validation || mutation.error}</Notice>}<div className="flex justify-end gap-3 border-t border-border pt-5"><Button variant="secondary" disabled={mutation.pending} onClick={onClose}>{t("Cancel")}</Button><Button type="submit" disabled={mutation.pending || !productId || !warehouseId}>{mutation.pending ? t("Saving…") : t(titles[mode])}</Button></div></form></Modal>
}

export function InventoryPage() {
  useLanguage()
  const { session } = useAuth()
  const canManage = session?.role === 'Admin' || session?.role === 'Manager'
  const [params, setParams] = useSearchParams()
  const warehouseId = params.get('warehouseId') ?? ''
  const productId = params.get('productId') ?? ''
  const [movement, setMovement] = useState<{ mode: Movement; productId: string; warehouseId: string } | null>(null)
  const [notice, setNotice] = useState('')
  const references = useAsync(getReferenceData)
  const load = useCallback(() => getInventory({ warehouseId: warehouseId || undefined, productId: productId || undefined }), [warehouseId, productId])
  const query = useAsync(load)
  function filter(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }) }
  const columns = useMemo<ColumnDef<InventoryItemResponse>[]>(() => [
    { accessorKey: 'productName', header: 'Product', cell: ({ row }) => <div><p className="font-medium">{row.original.productName}</p><p className="mt-1 font-mono text-[10px] text-muted">{references.data?.products.find(p => p.id === row.original.productId)?.sku ?? 'Archived catalog item'}</p></div> },
    { accessorKey: 'warehouseCode', header: 'Warehouse', cell: info => <Badge tone="neutral">{String(info.getValue())}</Badge> },
    { accessorKey: 'quantity', header: 'On hand', cell: ({ row }) => <span className="font-medium tabular-nums">{number(row.original.quantity)} <span className="text-xs font-normal text-muted">{t(references.data?.products.find(p => p.id === row.original.productId)?.unitOfMeasure ?? "")}</span></span> },
    { id: 'level', header: 'Stock level', cell: ({ row }) => { const product = references.data?.products.find(p => p.id === row.original.productId); return product ? <Badge tone={row.original.quantity < product.lowStockThreshold ? 'amber' : 'green'}>{row.original.quantity < product.lowStockThreshold ? t("Below threshold") : t("In range")}</Badge> : <Badge tone="neutral">{t("Archived")}</Badge> } },
    { id: 'actions', header: 'Movements', cell: ({ row }) => { const item = row.original; const active = references.data?.products.some(p => p.id === item.productId) && references.data?.warehouses.some(w => w.id === item.warehouseId); return active ? <div className="flex gap-1"><button aria-label={`Receive ${item.productName} at ${item.warehouseCode}`} onClick={() => setMovement({ mode: 'in', productId: item.productId, warehouseId: item.warehouseId })} className="rounded-lg p-2 text-muted hover:bg-surface"><ArrowDownLeft size={16} /></button><button aria-label={`Issue ${item.productName} from ${item.warehouseCode}`} onClick={() => setMovement({ mode: 'out', productId: item.productId, warehouseId: item.warehouseId })} className="rounded-lg p-2 text-muted hover:bg-surface"><ArrowUpRight size={16} /></button>{canManage && <button aria-label={`Adjust ${item.productName} at ${item.warehouseCode}`} onClick={() => setMovement({ mode: 'adjust', productId: item.productId, warehouseId: item.warehouseId })} className="rounded-lg p-2 text-muted hover:bg-surface"><SlidersHorizontal size={15} /></button>}</div> : <span className="text-xs text-muted">{t("Read only")}</span> } },
  ], [canManage, references.data])
  const ready = !!references.data?.products.length && !!references.data.warehouses.length
  return <><PageHeading eyebrow={t("Operations / Inventory")} title={t("Know what is on hand.")} description={t("Find stock across your warehouses, receive deliveries, and keep every balance accounted for.")}><div className="flex flex-wrap gap-2"><Button variant="secondary" disabled={!ready} onClick={() => setMovement({ mode: 'out', productId, warehouseId })}><ArrowUpRight size={16} />{t("Issue stock")}</Button><Button disabled={!ready} onClick={() => setMovement({ mode: 'in', productId, warehouseId })}><ArrowDownLeft size={16} />{t("Receive stock")}</Button></div></PageHeading>{notice && <div className="mb-5"><Notice success>{notice}</Notice></div>}{references.error && <div className="mb-5"><LoadError message={references.error} retry={references.refresh} /></div>}<div className="mb-6 grid items-end gap-4 rounded-xl border border-border bg-white p-5 sm:grid-cols-[1fr_1fr_auto]"><WarehouseSelect warehouses={references.data?.warehouses ?? []} value={warehouseId} onChange={value => filter('warehouseId', value)} all disabled={references.loading} /><ProductSelect products={references.data?.products ?? []} value={productId} onChange={value => filter('productId', value)} all disabled={references.loading} /><div className="flex gap-2"><Button variant="secondary" onClick={() => setParams({})} disabled={!warehouseId && !productId}>{t("Clear")}</Button><Button variant="secondary" aria-label={t("Refresh inventory")} onClick={query.refresh} disabled={query.loading}><RefreshCw size={16} /></Button></div></div>{query.loading ? <Loading label={t("Loading inventory…")} /> : query.error ? <LoadError message={query.error} retry={query.refresh} /> : <DataTable key={`${warehouseId}:${productId}`} caption={t("Inventory balances")} data={query.data ?? []} columns={columns} emptyTitle={t("No stock in this view")} emptyDescription={t("Try another filter, or receive stock to create a balance for a product and warehouse.")} />}{movement && references.data && <MovementForm mode={movement.mode} references={references.data} initialProduct={movement.productId} initialWarehouse={movement.warehouseId} onClose={() => setMovement(null)} onSaved={() => { setMovement(null); setNotice('Stock movement recorded successfully.'); query.refresh() }} />}</>
}
