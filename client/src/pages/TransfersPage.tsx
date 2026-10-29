import { t, useLanguage } from '../i18n/language'
import { useCallback, useMemo, useState } from 'react'
import type { SubmitEvent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowRight, ArrowRightLeft, Plus, RefreshCw } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { createTransfer, getTransfers } from '../services/transferService'
import { getReferenceData } from '../services/referenceService'
import { getInventory } from '../services/inventoryService'
import type { StockTransferResponse } from '../types/transfer'
import { number } from '../lib/format'
import { DataTable } from '../components/ui/DataTable'
import { Badge, Button, LoadError, Loading, Notice, PageHeading } from '../components/ui/Ui'
import { Input } from '../components/ui/Fields'
import { Modal } from '../components/ui/Modal'
import { ProductSelect, WarehouseSelect } from '../components/ui/ReferenceSelects'
import type { References } from '../components/ui/ReferenceSelects'

function TransferForm({ references, onClose, onSaved }: { references: References; onClose: () => void; onSaved: () => void }) {
  useLanguage()
  const [productId, setProductId] = useState('')
  const [fromWarehouseId, setFrom] = useState('')
  const [toWarehouseId, setTo] = useState('')
  const [validation, setValidation] = useState('')
  const mutation = useMutation()
  const loadBalance = useCallback(() => productId && fromWarehouseId ? getInventory({ productId, warehouseId: fromWarehouseId }) : Promise.resolve([]), [productId, fromWarehouseId])
  const balance = useAsync(loadBalance)
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const quantity = Number(new FormData(event.currentTarget).get('quantity'))
    if (fromWarehouseId === toWarehouseId) { setValidation('Choose two different warehouses.'); return }
    if (!Number.isFinite(quantity) || quantity <= 0) { setValidation('Transfer quantity must be greater than zero.'); return }
    setValidation('')
    void mutation.run(() => createTransfer({ productId, fromWarehouseId, toWarehouseId, quantity }), onSaved)
  }
  return <Modal title={t("Move stock between warehouses")} description={t("The source balance decreases and the destination balance increases together when you confirm.")} busy={mutation.pending} onClose={onClose}><form onSubmit={submit} className="space-y-5"><ProductSelect products={references.products} value={productId} onChange={setProductId} disabled={mutation.pending} /><WarehouseSelect label={t("From warehouse")} warehouses={references.warehouses} value={fromWarehouseId} onChange={value => { setFrom(value); if (value === toWarehouseId) setTo('') }} disabled={mutation.pending} /><div className="flex justify-center text-muted"><ArrowRightLeft size={20} /></div><WarehouseSelect label={t("To warehouse")} warehouses={references.warehouses} value={toWarehouseId} onChange={setTo} exclude={fromWarehouseId} disabled={mutation.pending} />{productId && fromWarehouseId && <p className="rounded-lg bg-surface px-4 py-3 text-xs text-muted">{balance.loading ? t("Checking source balance…") : balance.error ? 'Balance unavailable. The server will check available stock.' : <>{t("Available at source:")} <strong className="text-ink">{number(balance.data?.[0]?.quantity ?? 0)} {references.products.find(p => p.id === productId)?.unitOfMeasure}</strong></>}</p>}<Input label={t("Quantity to transfer")} type="number" name="quantity" required min="0" step="any" disabled={mutation.pending} placeholder="0" />{(validation || mutation.error) && <Notice>{validation || mutation.error}</Notice>}<div className="flex justify-end gap-3 border-t border-border pt-5"><Button variant="secondary" disabled={mutation.pending} onClick={onClose}>{t("Cancel")}</Button><Button type="submit" disabled={mutation.pending || !productId || !fromWarehouseId || !toWarehouseId}>{mutation.pending ? t("Transferring…") : t("Confirm transfer")}</Button></div></form></Modal>
}

export function TransfersPage() {
  useLanguage()
  const query = useAsync(getTransfers)
  const references = useAsync(getReferenceData)
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState('')
  const columns = useMemo<ColumnDef<StockTransferResponse>[]>(() => [
    { id: 'product', header: 'Product', accessorFn: row => references.data?.products.find(p => p.id === row.productId)?.name ?? row.productId, cell: ({ row }) => <div><p className="font-medium">{references.data?.products.find(p => p.id === row.original.productId)?.name ?? `${t("Archived product")} · ${row.original.productId.slice(0, 8)}`}</p><p className="mt-1 font-mono text-[10px] text-muted" title={row.original.id}>{t("Transfer")} {row.original.id.slice(0, 8)}</p></div> },
    { id: 'route', header: 'Route', enableSorting: false, cell: ({ row }) => <div className="flex items-center gap-2 whitespace-nowrap text-xs"><span>{references.data?.warehouses.find(w => w.id === row.original.fromWarehouseId)?.code ?? row.original.fromWarehouseId.slice(0, 8)}</span><ArrowRight size={14} className="text-muted rtl:rotate-180" /><span>{references.data?.warehouses.find(w => w.id === row.original.toWarehouseId)?.code ?? row.original.toWarehouseId.slice(0, 8)}</span></div> },
    { accessorKey: 'quantity', header: 'Quantity', cell: ({ row }) => <span className="tabular-nums">{number(row.original.quantity)} <span className="text-xs text-muted">{t(references.data?.products.find(p => p.id === row.original.productId)?.unitOfMeasure ?? "")}</span></span> },
    { accessorKey: 'status', header: 'Status', cell: info => <Badge tone={info.getValue() === 'Completed' ? 'green' : info.getValue() === 'Pending' ? 'amber' : 'neutral'}>{t(String(info.getValue()))}</Badge> },
  ], [references.data])
  const canTransfer = !!references.data?.products.length && (references.data?.warehouses.length ?? 0) >= 2
  return <><PageHeading eyebrow={t("Operations / Transfers")} title={t("Stock in the right place.")} description={t("Move products across your warehouse network with a clear record of every transfer.")}><div className="flex gap-2"><Button variant="secondary" onClick={query.refresh} disabled={query.loading} aria-label={t("Refresh transfers")}><RefreshCw size={16} /></Button><Button onClick={() => setCreating(true)} disabled={!canTransfer}><Plus size={16} />{t("New transfer")}</Button></div></PageHeading>{notice && <div className="mb-5"><Notice success>{notice}</Notice></div>}{references.error && <div className="mb-5"><LoadError message={references.error} retry={references.refresh} /></div>}{references.data && !canTransfer && <div className="mb-5 rounded-lg border border-border bg-white p-4 text-sm text-muted">{t("To create a transfer, you need at least one active product and two active warehouses.")}</div>}{query.loading || references.loading ? <Loading label={t("Loading transfers…")} /> : query.error ? <LoadError message={query.error} retry={query.refresh} /> : <DataTable caption={t("Stock transfers")} data={query.data ?? []} columns={columns} emptyTitle={t("No transfers yet")} emptyDescription={t("Your completed stock movements between warehouses will appear here.")} />}{creating && references.data && <TransferForm references={references.data} onClose={() => setCreating(false)} onSaved={() => { setCreating(false); setNotice('Transfer completed. Both warehouse balances have been updated.'); query.refresh() }} />}</>
}
