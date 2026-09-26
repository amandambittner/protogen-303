import { Stethoscope, Home, Landmark, ShoppingBag, Users, FileText, type LucideIcon } from 'lucide-vue-next'
import type { Category } from './types'

export interface CategoryConfig {
  key: Category
  label: string
  color: string
  icon: LucideIcon
}

export const categories: CategoryConfig[] = [
  { key: 'medical', label: 'Medical & Health', color: '#EB8F30', icon: Stethoscope },
  { key: 'nursery', label: 'Nursery & Home', color: '#44A87C', icon: Home },
  { key: 'financial', label: 'Financial & Legal', color: '#6B7FBB', icon: Landmark },
  { key: 'gear', label: 'Gear & Shopping', color: '#CC6060', icon: ShoppingBag },
  { key: 'support', label: 'Support & Planning', color: '#9B7EC8', icon: Users },
  { key: 'documents', label: 'Documents & Admin', color: '#47A8BD', icon: FileText },
]

export const categoryMap: Record<Category, CategoryConfig> = categories.reduce(
  (acc, c) => ({ ...acc, [c.key]: c }),
  {} as Record<Category, CategoryConfig>
)
