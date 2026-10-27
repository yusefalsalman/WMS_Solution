import { api } from '../lib/api'
import type {
  AuditLogEntry,
  AuditLogFilters,
  LowStockItem,
  WarehouseStockSummary,
} from '../types/report'

export async function getStockByWarehouse(): Promise<WarehouseStockSummary[]> {
  const response = await api.get<WarehouseStockSummary[]>('/Reports/stock-by-warehouse')
  return response.data
}

export async function getLowStock(warehouseId?: string): Promise<LowStockItem[]> {
  const response = await api.get<LowStockItem[]>('/Reports/low-stock', {params: { warehouseId },})
  return response.data
}

export async function getAuditLog(filters: AuditLogFilters = {}): Promise<AuditLogEntry[]> {
  const response = await api.get<AuditLogEntry[]>('/Reports/audit-log', { params: filters })
  return response.data
}
