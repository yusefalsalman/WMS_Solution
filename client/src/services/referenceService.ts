import { getProducts } from './productService'
import { getWarehouses } from './warehouseService'
import type { PagedResponse } from '../types/pagination'

// Selection lists must include every active record, not just the first API page.
async function allPages<T>(getPage: (page: number, pageSize: number) => Promise<PagedResponse<T>>): Promise<T[]> {
  const items: T[] = []
  let page = 1
  while (true) {
    const result = await getPage(page, 100)
    items.push(...result.items)
    if (items.length >= result.totalCount || result.items.length === 0) return items
    page++
  }
}

export async function getReferenceData() {
  const [products, warehouses] = await Promise.all([allPages(getProducts), allPages(getWarehouses)])
  return { products, warehouses }
}
