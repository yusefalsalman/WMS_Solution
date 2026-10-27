export interface LowStockAlertResponse {
  id: string
  sku: string
  productName: string
  warehouseCode: string
  currentQuantity: number
  thresholdAtDetection: number
  detectedAt: string
}
