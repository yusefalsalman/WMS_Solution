export type UnitOfMeasure = 'Piece' | 'Kilogram' | 'Liter' | 'Meter'

export interface ProductResponse {
  id: string
  sku: string
  name: string
  unitOfMeasure: UnitOfMeasure
  lowStockThreshold: number
}

export interface CreateProductRequest {
  sku: string
  name: string
  lowStockThreshold: number
  unitOfMeasure: UnitOfMeasure
}

export interface UpdateProductRequest {
  name: string
  unitOfMeasure: UnitOfMeasure
  lowStockThreshold: number
}
