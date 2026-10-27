export interface WarehouseResponse {
  id: string
  code: string
  name: string
  location: string
  isActive: boolean
}

export interface CreateWarehouseRequest {
  code: string
  name: string
  location: string
}

export interface UpdateWarehouseRequest {
  name: string
  location: string
  isActive: boolean
}
