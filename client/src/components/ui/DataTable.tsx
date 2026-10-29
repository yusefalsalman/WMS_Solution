import { number } from '../../lib/format'
import { t, useLanguage } from '../../i18n/language'
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Empty } from './Ui'

export interface ServerPagination { page: number; pageSize: number; totalCount: number; onChange: (page: number, pageSize: number) => void }

export function DataTable<T>({ data, columns, pagination, emptyTitle, emptyDescription, caption }: { data: T[]; columns: ColumnDef<T>[]; pagination?: ServerPagination; emptyTitle?: string; emptyDescription?: string; caption: string }) {
  useLanguage()
  // TanStack owns table state; paginated API responses are already sliced by the server.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data, columns, getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(),
    manualPagination: !!pagination, enableSorting: !pagination,
    rowCount: pagination?.totalCount,
    state: pagination ? { pagination: { pageIndex: pagination.page - 1, pageSize: pagination.pageSize } } : undefined,
    initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
  })
  const currentPage = pagination?.page ?? table.getState().pagination.pageIndex + 1
  const pageSize = pagination?.pageSize ?? table.getState().pagination.pageSize
  const total = pagination?.totalCount ?? data.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  function change(page: number, size = pageSize) {
    if (pagination) pagination.onChange(page, size)
    else { table.setPageSize(size); table.setPageIndex(page - 1) }
  }
  return <div className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_2px_8px_#23382d03]">
    {data.length ? <div className="overflow-x-auto"><table className="w-full border-collapse text-start text-sm"><caption className="sr-only">{caption}</caption><thead className="border-b border-border bg-[#fafbf7]">{table.getHeaderGroups().map(group => <tr key={group.id}>{group.headers.map(header => <th key={header.id} scope="col" aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : undefined} className="px-5 py-4 text-[10px] font-semibold tracking-[0.09em] text-muted uppercase">{header.isPlaceholder ? null : header.column.getCanSort() ? <button className="flex items-center gap-2 text-start focus-visible:outline-2" onClick={header.column.getToggleSortingHandler()}>{typeof header.column.columnDef.header === 'string' ? t(header.column.columnDef.header) : flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === 'asc' ? <ArrowUp size={12} /> : header.column.getIsSorted() === 'desc' ? <ArrowDown size={12} /> : <ChevronsUpDown size={12} />}</button> : typeof header.column.columnDef.header === 'string' ? t(header.column.columnDef.header) : flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map(row => <tr key={row.id} className="border-b border-border/65 last:border-0 hover:bg-[#f9faf5]">{row.getVisibleCells().map(cell => <td key={cell.id} className="max-w-sm px-5 py-4 align-middle break-words">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody></table></div> : <Empty title={emptyTitle} description={emptyDescription} />}
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-[#fcfcfa] px-5 py-3 text-xs text-muted"><span>{total === 0 ? t("0 records") : `${number((currentPage - 1) * pageSize + 1)}–${number(Math.min(currentPage * pageSize, total))} ${t("of")} ${number(total)} ${t("records")}`}</span><div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2">{t("Rows")}<select aria-label={t("Rows per page")} className="rounded-md border border-border bg-white px-2 py-1.5 text-ink" value={pageSize} onChange={e => change(1, Number(e.target.value))}>{[10, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}</select></label><span>{t("Page")} {number(currentPage)}  {t("of")} {number(totalPages)}</span><button aria-label={t("Previous page")} disabled={currentPage <= 1} onClick={() => change(currentPage - 1)} className="rounded-md border border-border p-1.5 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-35"><ChevronLeft size={16} className="rtl:rotate-180" /></button><button aria-label={t("Next page")} disabled={currentPage >= totalPages} onClick={() => change(currentPage + 1)} className="rounded-md border border-border p-1.5 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-35"><ChevronRight size={16} className="rtl:rotate-180" /></button></div></footer>
  </div>
}
