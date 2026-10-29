import { t, useLanguage } from '../i18n/language'
import { useCallback, useMemo, useState } from 'react'
import type { SubmitEvent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ClipboardList, Layers, ListFilter, RefreshCw } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { getAuditLog, getLowStock, getStockByWarehouse } from '../services/reportService'
import { getReferenceData } from '../services/referenceService'
import type { AuditLogEntry, AuditLogFilters, LowStockItem, WarehouseStockSummary } from '../types/report'
import { dateTime, movementName, number } from '../lib/format'
import { DataTable } from '../components/ui/DataTable'
import { Button, LoadError, Loading, Notice, PageHeading } from '../components/ui/Ui'
import { Input } from '../components/ui/Fields'
import { ProductSelect, WarehouseSelect } from '../components/ui/ReferenceSelects'

function StockSummary() {
  useLanguage()
  const query = useAsync(getStockByWarehouse)
  const columns = useMemo<ColumnDef<WarehouseStockSummary>[]>(() => [
    { accessorKey: 'warehouseName', header: 'Warehouse', cell: ({ row }) => <div><p className="font-medium">{row.original.warehouseName}</p><p className="mt-1 font-mono text-[10px] text-muted">{row.original.warehouseCode}</p></div> },
    { accessorKey: 'productCount', header: 'Product positions', cell: info => number(info.getValue<number>()) },
    { accessorKey: 'totalQuantity', header: 'Recorded quantity total', cell: info => number(info.getValue<number>()) },
  ], [])
  return <><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="max-w-xl text-xs leading-relaxed text-muted">{t("Quantity totals combine the recorded units in each warehouse. They are not a weight or volume conversion.")}</p><Button variant="secondary" onClick={query.refresh} disabled={query.loading}><RefreshCw size={14} />{t("Refresh")}</Button></div>{query.loading ? <Loading /> : query.error ? <LoadError message={query.error} retry={query.refresh} /> : <DataTable caption={t("Stock by warehouse")} columns={columns} data={query.data ?? []} emptyTitle={t("No warehouse summaries yet")} />}</>
}

function LowStockReport() {
  useLanguage()
  const [warehouseId, setWarehouseId] = useState('')
  const references = useAsync(getReferenceData)
  const load = useCallback(() => getLowStock(warehouseId || undefined), [warehouseId])
  const query = useAsync(load)
  const columns = useMemo<ColumnDef<LowStockItem>[]>(() => [
    { accessorKey: 'productName', header: 'Product', cell: ({ row }) => <div><p className="font-medium">{row.original.productName}</p><p className="mt-1 font-mono text-[10px] text-muted">{row.original.sku}</p></div> },
    { accessorKey: 'warehouseCode', header: 'Warehouse' },
    { accessorKey: 'quantity', header: 'On hand', cell: info => <span className="text-[#9b6a30]">{number(info.getValue<number>())}</span> },
    { accessorKey: 'lowStockThreshold', header: 'Current threshold', cell: info => number(info.getValue<number>()) },
    { id: 'shortfall', header: 'To reach threshold', accessorFn: row => row.lowStockThreshold - row.quantity, cell: info => number(info.getValue<number>()) },
  ], [])
  return <>{references.error && <div className="mb-5"><LoadError message={references.error} retry={references.refresh} /></div>}<div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div className="w-full max-w-sm"><WarehouseSelect warehouses={references.data?.warehouses ?? []} value={warehouseId} onChange={setWarehouseId} all disabled={references.loading} /></div><Button variant="secondary" onClick={query.refresh} disabled={query.loading}><RefreshCw size={14} />{t("Refresh")}</Button></div><p className="mb-4 text-xs text-muted">{t("Current balances below the current product threshold, calculated when you load this report.")}</p>{query.loading ? <Loading /> : query.error ? <LoadError message={query.error} retry={query.refresh} /> : <DataTable key={warehouseId} caption={t("Low-stock report")} columns={columns} data={query.data ?? []} emptyTitle={t("Stock is within range")} emptyDescription={t("No products fall below their threshold in this view.")} />}</>
}

function AuditReport() {
  useLanguage()
  const references = useAsync(getReferenceData)
  const [warehouseId, setWarehouseId] = useState('')
  const [productId, setProductId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [validation, setValidation] = useState('')
  const [filters, setFilters] = useState<AuditLogFilters>({})
  const load = useCallback(() => getAuditLog(filters), [filters])
  const query = useAsync(load)
  const columns = useMemo<ColumnDef<AuditLogEntry>[]>(() => [
    { accessorKey: 'createdAt', header: 'Date & time', cell: info => <span className="whitespace-nowrap text-xs">{dateTime(info.getValue<string>())}</span> },
    { accessorKey: 'sku', header: 'SKU', cell: info => <span className="font-mono text-xs">{String(info.getValue())}</span> },
    { accessorKey: 'warehouseCode', header: 'Warehouse' },
    { accessorKey: 'movementType', header: 'Movement', cell: info => <span className="whitespace-nowrap text-xs">{movementName(info.getValue<string>())}</span> },
    { accessorKey: 'quantityChanged', header: 'Change', cell: info => <span className={`font-medium tabular-nums ${info.getValue<number>() >= 0 ? 'text-[#58734a]' : 'text-[#a26d3a]'}`}>{info.getValue<number>() > 0 ? '+' : ''}{number(info.getValue<number>())}</span> },
    { accessorKey: 'quantityAfter', header: 'Balance after', cell: info => number(info.getValue<number>()) },
    { accessorKey: 'reason', header: 'Reason', cell: info => <span className="text-xs text-muted">{info.getValue<string | null>() || '—'}</span> },
  ], [])
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (from && to && from > to) { setValidation('The end date must be on or after the start date.'); return }
    setValidation('')
    // The API uses an exclusive upper bound. Include the entire selected end day.
    const end = to ? new Date(`${to}T00:00:00`) : undefined
    if (end) end.setDate(end.getDate() + 1)
    setFilters({ productId: productId || undefined, warehouseId: warehouseId || undefined, from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined, to: end?.toISOString() })
  }
  function clear() { setWarehouseId(''); setProductId(''); setFrom(''); setTo(''); setValidation(''); setFilters({}) }
  return <>{references.error && <div className="mb-5"><LoadError message={references.error} retry={references.refresh} /></div>}<form onSubmit={submit} className="mb-5 space-y-4 rounded-xl border border-border bg-white p-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><WarehouseSelect warehouses={references.data?.warehouses ?? []} value={warehouseId} onChange={setWarehouseId} all disabled={references.loading} /><ProductSelect products={references.data?.products ?? []} value={productId} onChange={setProductId} all disabled={references.loading} /><Input label={t("From date")} type="date" value={from} onChange={event => setFrom(event.target.value)} /><Input label={t("Through date")} type="date" value={to} onChange={event => setTo(event.target.value)} /></div>{validation && <Notice>{validation}</Notice>}<div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[11px] text-muted">{t("Dates use your local time. Results include up to 500 most recent movements.")}</p><div className="flex gap-2"><Button variant="secondary" onClick={clear}>{t("Clear")}</Button><Button type="submit" disabled={query.loading}><ListFilter size={15} />{t("Apply filters")}</Button></div></div></form>{query.loading ? <Loading label={t("Loading movement history…")} /> : query.error ? <LoadError message={query.error} retry={query.refresh} /> : <DataTable key={JSON.stringify(filters)} caption={t("Inventory audit log")} columns={columns} data={query.data ?? []} emptyTitle={t("No movements match these filters")} emptyDescription={t("Try a wider date range or clear the product and warehouse filters.")} />}</>
}

export function ReportsPage() {
  useLanguage()
  const [tab, setTab] = useState('summary')
  return <><PageHeading eyebrow={t("Insights / Reports & activity")} title={t("See the story behind the stock.")} description={t("Warehouse summaries, low-stock positions, and a traceable record of inventory movements.")} /><div role="tablist" aria-label={t("Report type")} className="mb-7 flex gap-1 overflow-x-auto rounded-xl border border-border bg-white p-1.5">{[{ id: 'summary', name: 'Warehouse summary', icon: Layers }, { id: 'low', name: 'Low-stock report', icon: ListFilter }, { id: 'audit', name: 'Movement history', icon: ClipboardList }].map(({ id, name, icon: Icon }) => <button key={id} id={`tab-${id}`} role="tab" aria-selected={tab === id} aria-controls={`panel-${id}`} onClick={() => setTab(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-xs font-medium ${tab === id ? 'bg-[#eaf0e1] text-[#405b33]' : 'text-muted hover:bg-surface'}`}><Icon size={16} />{t(name)}</button>)}</div><section role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>{tab === 'summary' ? <StockSummary /> : tab === 'low' ? <LowStockReport /> : <AuditReport />}</section></>
}
