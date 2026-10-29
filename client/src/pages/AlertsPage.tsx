import { t, useLanguage } from '../i18n/language'
import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Bell, RefreshCw } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { getActiveAlerts } from '../services/alertService'
import { getReferenceData } from '../services/referenceService'
import type { LowStockAlertResponse } from '../types/alert'
import { dateTime, number } from '../lib/format'
import { DataTable } from '../components/ui/DataTable'
import { Badge, Button, LoadError, Loading, PageHeading } from '../components/ui/Ui'
import { WarehouseSelect } from '../components/ui/ReferenceSelects'

export function AlertsPage() {
  useLanguage()
  const [warehouseId, setWarehouseId] = useState('')
  const references = useAsync(getReferenceData)
  const load = useCallback(() => getActiveAlerts(warehouseId || undefined), [warehouseId])
  const query = useAsync(load)
  const columns = useMemo<ColumnDef<LowStockAlertResponse>[]>(() => [
    { accessorKey: 'productName', header: 'Product', cell: ({ row }) => <div><p className="font-medium">{row.original.productName}</p><p className="mt-1 font-mono text-[10px] text-muted">{row.original.sku}</p></div> },
    { accessorKey: 'warehouseCode', header: 'Warehouse' },
    { accessorKey: 'currentQuantity', header: 'Current quantity', cell: info => <span className="font-medium tabular-nums text-[#9b6a30]">{number(info.getValue<number>())}</span> },
    { accessorKey: 'thresholdAtDetection', header: 'Threshold at detection', cell: info => number(info.getValue<number>()) },
    { accessorKey: 'detectedAt', header: 'Detected', cell: info => <span className="whitespace-nowrap text-xs text-muted">{dateTime(info.getValue<string>())}</span> },
  ], [])
  return <><PageHeading eyebrow={t("Insights / Stock alerts")} title={t("A little notice. A big difference.")} description={t("Watch the products that dropped below their threshold and plan the next replenishment.")}><Button variant="secondary" onClick={query.refresh} disabled={query.loading}><RefreshCw size={16} />{t("Refresh alerts")}</Button></PageHeading><div className="mb-6 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-[#e8d9b8] bg-[#fff7e9] p-5"><div className="flex items-start gap-3"><Bell className="mt-0.5 shrink-0 text-[#a77d3a]" size={20} /><div><h2 className="text-sm font-medium">{t("A periodic check, not an instant notification")}</h2><p className="mt-1 max-w-xl text-xs leading-relaxed text-[#8f7b58]">{t("Alerts are checked every five minutes. After replenishing stock, an alert can remain active until the next check. Thresholds shown are those recorded at detection.")}</p></div></div>{query.data && <Badge tone={query.data.length ? 'amber' : 'green'}>{query.data.length}  {t("active")}</Badge>}</div>{references.error && <div className="mb-5"><LoadError message={references.error} retry={references.refresh} /></div>}<div className="mb-5 max-w-sm"><WarehouseSelect warehouses={references.data?.warehouses ?? []} value={warehouseId} onChange={setWarehouseId} all disabled={references.loading} /></div>{query.loading ? <Loading label={t("Loading active alerts…")} /> : query.error ? <LoadError message={query.error} retry={query.refresh} /> : <DataTable key={warehouseId} caption={t("Active low-stock alerts")} columns={columns} data={query.data ?? []} emptyTitle={t("All clear in this view")} emptyDescription={t("There are no active alerts for the selected warehouses.")} />}</>
}
