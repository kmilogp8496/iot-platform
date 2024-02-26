import { ref } from 'vue'

export interface TableColumn<T extends Record<string, any>> {
  [key: string]: any
  key: keyof T | (string & NonNullable<unknown>)
  sortable?: boolean
  sort?: (a: T, b: T, direction: 'asc' | 'desc') => number
  direction?: 'asc' | 'desc'
  class?: string
  label: string
  hidden?: MaybeRef<boolean>
  transform?: (row: T) => string
}

export function useTableColumns<T extends Record<string, any>>(columns: TableColumn<T>[]) {
  return ref(columns)
}
