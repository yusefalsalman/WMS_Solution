import { t, useLanguage } from '../i18n/language'
import { useCallback, useMemo, useState } from 'react'
import type { SubmitEvent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Box, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/productService'
import type { ProductResponse, UnitOfMeasure } from '../types/product'
import { number } from '../lib/format'
import { DataTable } from '../components/ui/DataTable'
import { Button, LoadError, Loading, Notice, PageHeading } from '../components/ui/Ui'
import { Input, Select } from '../components/ui/Fields'
import { DeleteDialog, Modal } from '../components/ui/Modal'

function ProductForm({ product, onClose, onSaved }: { product?: ProductResponse; onClose: () => void; onSaved: () => void }) {
  useLanguage()
  const mutation = useMutation()
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const values = { name: String(form.get('name')).trim(), lowStockThreshold: Number(form.get('lowStockThreshold')), unitOfMeasure: form.get('unitOfMeasure') as UnitOfMeasure }
    void mutation.run(() => product ? updateProduct(product.id, values) : createProduct({ ...values, sku: String(form.get('sku')).trim() }), onSaved)
  }
  return <Modal title={product ? t("Edit product") : t("Add a product")} description={t("Keep your catalog clear and give each product a stock threshold.")} busy={mutation.pending} onClose={onClose}><form onSubmit={submit} className="space-y-5"><Input label={t("SKU")} name="sku" defaultValue={product?.sku} required maxLength={50} disabled={!!product || mutation.pending} placeholder={t("e.g. PKG-001")} hint={product ? t("The SKU identifies this product and cannot be changed.") : t("A unique code for this product.")} /><Input label={t("Product name")} name="name" defaultValue={product?.name} required maxLength={500} disabled={mutation.pending} placeholder={t("e.g. Packing tape")} /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Select label={t("Unit of measure")} name="unitOfMeasure" defaultValue={product?.unitOfMeasure ?? 'Piece'} disabled={mutation.pending}>{['Piece', 'Kilogram', 'Liter', 'Meter'].map(unit => <option key={unit} value={unit}>{t(unit)}</option>)}</Select><Input label={t("Low-stock threshold")} name="lowStockThreshold" type="number" min="0" step="any" defaultValue={product?.lowStockThreshold ?? 0} required disabled={mutation.pending} /></div>{mutation.error && <Notice>{mutation.error}</Notice>}<div className="flex justify-end gap-3 border-t border-border pt-5"><Button variant="secondary" disabled={mutation.pending} onClick={onClose}>{t("Cancel")}</Button><Button type="submit" disabled={mutation.pending}>{mutation.pending ? t("Saving…") : product ? 'Save changes' : 'Create product'}</Button></div></form></Modal>
}

export function ProductsPage() {
  useLanguage()
  const { session } = useAuth()
  const canManage = session?.role === 'Admin' || session?.role === 'Manager'
  const [paging, setPaging] = useState({ page: 1, pageSize: 20 })
  const [editing, setEditing] = useState<ProductResponse | 'new' | null>(null)
  const [deleting, setDeleting] = useState<ProductResponse | null>(null)
  const [notice, setNotice] = useState('')
  const load = useCallback(() => getProducts(paging.page, paging.pageSize), [paging])
  const query = useAsync(load)
  const columns = useMemo<ColumnDef<ProductResponse>[]>(() => [
    { accessorKey: 'name', header: 'Product', cell: ({ row }) => <div className="flex items-center gap-3"><span className="hidden rounded-lg border border-border bg-surface p-2.5 text-[#718267] sm:block"><Box size={18} strokeWidth={1.5} /></span><div><p className="font-medium">{row.original.name}</p><p className="mt-1 font-mono text-[10px] text-muted">{row.original.sku}</p></div></div> },
    { accessorKey: 'unitOfMeasure', header: 'Unit', cell: info => <span className="text-muted">{t(String(info.getValue()))}</span> },
    { accessorKey: 'lowStockThreshold', header: 'Low-stock threshold', cell: info => <span className="tabular-nums">{number(info.getValue<number>())}</span> },
    ...(canManage ? [{ id: 'actions', header: 'Actions', cell: ({ row }) => <div className="flex gap-1"><button aria-label={`${t("Edit")} ${row.original.name}`} onClick={() => setEditing(row.original)} className="rounded-lg p-2 text-muted hover:bg-surface hover:text-ink"><Pencil size={15} /></button><button aria-label={`${t("Delete")} ${row.original.name}`} onClick={() => setDeleting(row.original)} className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></button></div> } satisfies ColumnDef<ProductResponse>] : []),
  ], [canManage])
  function saved() { setEditing(null); setNotice('Product saved successfully.'); query.refresh() }
  function removed() { setDeleting(null); setNotice('Product removed from the active catalog.'); if (query.data?.items.length === 1 && paging.page > 1) setPaging({ ...paging, page: paging.page - 1 }); else query.refresh() }
  return <><PageHeading eyebrow={t("Catalog / Products")} title={t("Everything you stock.")} description={t("A clear catalog, consistent units, and the right threshold for every product.")}><div className="flex gap-2"><Button variant="secondary" onClick={query.refresh} disabled={query.loading} aria-label={t("Refresh products")}><RefreshCw size={16} /></Button>{canManage && <Button onClick={() => setEditing('new')}><Plus size={16} />{t("Add product")}</Button>}</div></PageHeading>{notice && <div className="mb-5"><Notice success>{notice}</Notice></div>}<div className="mb-4 flex items-center justify-between text-xs text-muted"><span>{t("Active catalog")} {query.data && <span className="ms-2 rounded-full bg-[#e6eade] px-2 py-1 text-ink">{query.data.totalCount}</span>}</span><span>{t("Ordered by product name")}</span></div>{query.loading ? <Loading label={t("Loading products…")} /> : query.error ? <LoadError message={query.error} retry={query.refresh} /> : query.data && <DataTable caption={t("Products")} columns={columns} data={query.data.items} pagination={{ ...paging, totalCount: query.data.totalCount, onChange: (page, pageSize) => setPaging({ page, pageSize }) }} emptyTitle={t("Your catalog starts here")} emptyDescription={t("Add your first product to start tracking it across warehouses.")} />}{editing && <ProductForm product={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} onSaved={saved} />}{deleting && <DeleteDialog title={`${t("Delete")} ${deleting.name}?`} description={t("This product will leave the active catalog. Its existing inventory and movement history are retained.")} remove={() => deleteProduct(deleting.id)} onClose={() => setDeleting(null)} onSuccess={removed} />}</>
}
