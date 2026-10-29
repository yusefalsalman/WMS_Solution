import { t, useLanguage } from '../i18n/language'
import { useCallback, useMemo, useState } from 'react'
import type { SubmitEvent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'
import { ArrowUpRight, MapPin, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { createWarehouse, deleteWarehouse, getWarehouses, updateWarehouse } from '../services/warehouseService'
import type { WarehouseResponse } from '../types/warehouse'
import { DataTable } from '../components/ui/DataTable'
import { Badge, Button, LoadError, Loading, Notice, PageHeading } from '../components/ui/Ui'
import { Input, Select } from '../components/ui/Fields'
import { DeleteDialog, Modal } from '../components/ui/Modal'

function WarehouseForm({ warehouse, onClose, onSaved }: { warehouse?: WarehouseResponse; onClose: () => void; onSaved: () => void }) {
  useLanguage()
  const mutation = useMutation()
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const values = { name: String(form.get('name')).trim(), location: String(form.get('location')).trim() }
    void mutation.run(() => warehouse ? updateWarehouse(warehouse.id, { ...values, isActive: form.get('isActive') === 'true' }) : createWarehouse({ ...values, code: String(form.get('code')).trim() }), onSaved)
  }
  return <Modal title={warehouse ? t("Edit warehouse") : t("Add a warehouse")} description={t("Give your storage location a clear name and a unique code.")} busy={mutation.pending} onClose={onClose}><form onSubmit={submit} className="space-y-5"><Input label={t("Warehouse code")} name="code" required maxLength={20} defaultValue={warehouse?.code} disabled={!!warehouse || mutation.pending} placeholder={t("e.g. WH-AMM")} /><Input label={t("Warehouse name")} name="name" required maxLength={200} defaultValue={warehouse?.name} disabled={mutation.pending} placeholder={t("e.g. Amman central")} /><Input label={t("Location")} name="location" required maxLength={300} defaultValue={warehouse?.location} disabled={mutation.pending} placeholder={t("City, district, or address")} />{warehouse && <><Select label={t("Status")} name="isActive" defaultValue={String(warehouse.isActive)} disabled={mutation.pending}><option value="true">{t("Active")}</option><option value="false">{t("Inactive")}</option></Select><p className="text-xs leading-relaxed text-muted">{t("Inactive warehouses leave this list and cannot receive new stock movements. Existing history is retained.")}</p></>}{mutation.error && <Notice>{mutation.error}</Notice>}<div className="flex justify-end gap-3 border-t border-border pt-5"><Button variant="secondary" disabled={mutation.pending} onClick={onClose}>{t("Cancel")}</Button><Button type="submit" disabled={mutation.pending}>{mutation.pending ? t("Saving…") : warehouse ? 'Save changes' : 'Create warehouse'}</Button></div></form></Modal>
}

export function WarehousesPage() {
  useLanguage()
  const { session } = useAuth()
  const canManage = session?.role === 'Admin' || session?.role === 'Manager'
  const [paging, setPaging] = useState({ page: 1, pageSize: 20 })
  const [editing, setEditing] = useState<WarehouseResponse | 'new' | null>(null)
  const [deleting, setDeleting] = useState<WarehouseResponse | null>(null)
  const [notice, setNotice] = useState('')
  const load = useCallback(() => getWarehouses(paging.page, paging.pageSize), [paging])
  const query = useAsync(load)
  const columns = useMemo<ColumnDef<WarehouseResponse>[]>(() => [
    { accessorKey: 'name', header: 'Warehouse', cell: ({ row }) => <div><p className="font-medium">{row.original.name}</p><p className="mt-1 font-mono text-[10px] text-muted">{row.original.code}</p></div> },
    { accessorKey: 'location', header: 'Location', cell: info => <span className="flex items-center gap-2 text-muted"><MapPin size={14} className="shrink-0" />{String(info.getValue())}</span> },
    { accessorKey: 'isActive', header: 'Status', cell: ({ row }) => <Badge tone={row.original.isActive ? 'green' : 'neutral'}>{row.original.isActive ? t("Active") : t("Inactive")}</Badge> },
    { id: 'actions', header: 'Actions', cell: ({ row }) => <div className="flex items-center gap-1"><Link aria-label={`${t("View inventory for")} ${row.original.name}`} to={`/inventory?warehouseId=${row.original.id}`} className="rounded-lg p-2 text-muted hover:bg-surface hover:text-ink"><ArrowUpRight size={16} /></Link>{canManage && <><button aria-label={`${t("Edit")} ${row.original.name}`} onClick={() => setEditing(row.original)} className="rounded-lg p-2 text-muted hover:bg-surface hover:text-ink"><Pencil size={15} /></button><button aria-label={`${t("Delete")} ${row.original.name}`} onClick={() => setDeleting(row.original)} className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></button></>}</div> },
  ], [canManage])
  function changed(message: string) { setEditing(null); setDeleting(null); setNotice(message); if (paging.page > 1) setPaging({ ...paging, page: 1 }); else query.refresh() }
  return <><PageHeading eyebrow={t("Network / Warehouses")} title={t("Space for every possibility.")} description={t("Your storage locations, connected. Open a warehouse to see what is on its shelves.")}><div className="flex gap-2"><Button variant="secondary" onClick={query.refresh} disabled={query.loading} aria-label={t("Refresh warehouses")}><RefreshCw size={16} /></Button>{canManage && <Button onClick={() => setEditing('new')}><Plus size={16} />{t("Add warehouse")}</Button>}</div></PageHeading>{notice && <div className="mb-5"><Notice success>{notice}</Notice></div>}<div className="mb-4 flex justify-between text-xs text-muted"><span>{t("Active locations")} {query.data && `· ${query.data.totalCount}`}</span><span>{t("Ordered by name")}</span></div>{query.loading ? <Loading label={t("Loading warehouses…")} /> : query.error ? <LoadError message={query.error} retry={query.refresh} /> : query.data && <DataTable caption={t("Warehouses")} columns={columns} data={query.data.items} pagination={{ ...paging, totalCount: query.data.totalCount, onChange: (page, pageSize) => setPaging({ page, pageSize }) }} emptyTitle={t("A home for your inventory")} emptyDescription={t("Create a warehouse to start receiving and moving stock.")} />}{editing && <WarehouseForm warehouse={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} onSaved={() => changed('Warehouse saved successfully.')} />}{deleting && <DeleteDialog title={`${t("Delete")} ${deleting.name}?`} description={t("This warehouse will become inactive and leave the list. Existing inventory and movement history will be retained.")} remove={() => deleteWarehouse(deleting.id)} onClose={() => setDeleting(null)} onSuccess={() => changed('Warehouse removed from the active network.')} />}</>
}
