import { t, useLanguage } from '../../i18n/language'
import { Select } from './Fields'
import type { ProductResponse } from '../../types/product'
import type { WarehouseResponse } from '../../types/warehouse'

export interface References { products: ProductResponse[]; warehouses: WarehouseResponse[] }

export function ProductSelect({ products, value, onChange, all = false, disabled = false }: { products: ProductResponse[]; value: string; onChange: (value: string) => void; all?: boolean; disabled?: boolean }) {
  useLanguage()
  return <Select label={t("Product")} value={value} onChange={event => onChange(event.target.value)} required={!all} disabled={disabled}><option value="">{all ? t("All products") : t("Choose a product")}</option>{value && !products.some(product => product.id === value) && <option value={value}>{t("Unavailable product ·")} {value.slice(0, 8)}</option>}{products.map(product => <option key={product.id} value={product.id}>{product.name} · {product.sku}</option>)}</Select>
}

export function WarehouseSelect({ warehouses, value, onChange, label = 'Warehouse', all = false, disabled = false, exclude }: { warehouses: WarehouseResponse[]; value: string; onChange: (value: string) => void; label?: string; all?: boolean; disabled?: boolean; exclude?: string }) {
  useLanguage()
  return <Select label={label} value={value} onChange={event => onChange(event.target.value)} required={!all} disabled={disabled}><option value="">{all ? t("All warehouses") : t("Choose a warehouse")}</option>{value && !warehouses.some(warehouse => warehouse.id === value) && <option value={value}>{t("Unavailable warehouse ·")} {value.slice(0, 8)}</option>}{warehouses.map(warehouse => <option key={warehouse.id} value={warehouse.id} disabled={warehouse.id === exclude}>{warehouse.code} · {warehouse.name}</option>)}</Select>
}
