export interface WarehouseStockSummary {
  warehouseCode: string
  warehouseName: string
  productCount: number
  totalQuantity: number
}

export interface LowStockItem {
  sku: string
  productName: string
  warehouseCode: string
  quantity: number
  lowStockThreshold: number
}

export interface AuditLogEntry {
  createdAt: string
  sku: string
  warehouseCode: string
  movementType: string
  quantityChanged: number
  quantityAfter: number
  reason: string | null
}

export interface AuditLogFilters {
  productId?: string
  warehouseId?: string
  from?: string
  to?: string
}
