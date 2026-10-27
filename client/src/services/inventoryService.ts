import { api } from '../lib/api'
import type {
  AdjustStockRequest,
  InventoryFilters,
  InventoryItemResponse,
  StockMovementRequest,
} from '../types/inventory'

export async function getInventory(filters: InventoryFilters = {}): Promise<InventoryItemResponse[]> {
  const response = await api.get<InventoryItemResponse[]>('/Inventory', { params: filters })
  return response.data
}

export async function stockIn(request: StockMovementRequest): Promise<InventoryItemResponse> {
  const response = await api.post<InventoryItemResponse>('/Inventory/stock-in', request)
  return response.data
}

export async function stockOut(request: StockMovementRequest): Promise<InventoryItemResponse> {
  const response = await api.post<InventoryItemResponse>('/Inventory/stock-out', request)
  return response.data
}

export async function adjustStock(request: AdjustStockRequest): Promise<InventoryItemResponse> {
  const response = await api.post<InventoryItemResponse>('/Inventory/adjust', request)
  return response.data
}
