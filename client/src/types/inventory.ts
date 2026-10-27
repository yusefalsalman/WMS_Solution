export interface InventoryItemResponse {
  id: string
  productId: string
  warehouseId: string
  quantity: number
  productName: string
  warehouseCode: string
}

export interface InventoryFilters {
  productId?: string
  warehouseId?: string
}

export interface StockMovementRequest {
  productId: string
  warehouseId: string
  quantity: number
  reason?: string | null
}

export interface AdjustStockRequest {
  productId: string
  warehouseId: string
  newQuantity: number
  reason: string
}
