import { api } from '../lib/api'
import type { LowStockAlertResponse } from '../types/alert'

export async function getActiveAlerts(warehouseId?: string): Promise<LowStockAlertResponse[]> {
  const response = await api.get<LowStockAlertResponse[]>('/alerts', {
    params: { warehouseId },
  })
  return response.data
}
