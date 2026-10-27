import { api } from '../lib/api'
import type { PagedResponse } from '../types/pagination'
import type {
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  WarehouseResponse,
} from '../types/warehouse'

export async function getWarehouses(page = 1, pageSize = 20): Promise<PagedResponse<WarehouseResponse>> {
  const response = await api.get<PagedResponse<WarehouseResponse>>('/Warehouses', {
    params: { page, pageSize },
  })
  return response.data
}

export async function getWarehouse(id: string): Promise<WarehouseResponse> {
  const response = await api.get<WarehouseResponse>(`/Warehouses/${encodeURIComponent(id)}`)
  return response.data
}

export async function createWarehouse(request: CreateWarehouseRequest): Promise<WarehouseResponse> {
  const response = await api.post<WarehouseResponse>('/Warehouses', request)
  return response.data
}

export async function updateWarehouse(id: string, request: UpdateWarehouseRequest): Promise<WarehouseResponse> {
  const response = await api.put<WarehouseResponse>(`/Warehouses/${encodeURIComponent(id)}`, request)
  return response.data
}

export async function deleteWarehouse(id: string): Promise<void> {
  await api.delete(`/Warehouses/${encodeURIComponent(id)}`)
}
