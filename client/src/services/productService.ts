import { api } from '../lib/api'
import type { PagedResponse } from '../types/pagination'
import type {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from '../types/product'

export async function getProducts(page = 1, pageSize = 20): Promise<PagedResponse<ProductResponse>> {
  const response = await api.get<PagedResponse<ProductResponse>>('/Products', {
    params: { page, pageSize },
  })
  return response.data
}

export async function getProduct(id: string): Promise<ProductResponse> {
  const response = await api.get<ProductResponse>(`/Products/${encodeURIComponent(id)}`)
  return response.data
}

export async function createProduct(request: CreateProductRequest): Promise<ProductResponse> {
  const response = await api.post<ProductResponse>('/Products', request)
  return response.data
}

export async function updateProduct(id: string, request: UpdateProductRequest): Promise<ProductResponse> {
  const response = await api.put<ProductResponse>(`/Products/${encodeURIComponent(id)}`, request)
  return response.data
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/Products/${encodeURIComponent(id)}`)
}
