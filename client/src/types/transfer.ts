export type TransferStatus = 'Pending' | 'Completed' | 'Canceled'

export interface StockTransferResponse {
  id: string
  productId: string
  fromWarehouseId: string
  toWarehouseId: string
  quantity: number
  status: TransferStatus
}

export interface CreateStockTransferRequest {
  productId: string
  fromWarehouseId: string
  toWarehouseId: string
  quantity: number
}
