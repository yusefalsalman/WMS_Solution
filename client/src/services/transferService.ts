import { api } from '../lib/api'
import type { CreateStockTransferRequest, StockTransferResponse } from '../types/transfer'

export async function getTransfers(): Promise<StockTransferResponse[]> {
  const response = await api.get<StockTransferResponse[]>('/Transfers')
  return response.data
}

export async function createTransfer(request: CreateStockTransferRequest): Promise<StockTransferResponse> {
  const response = await api.post<StockTransferResponse>('/Transfers', request)
  return response.data
}
