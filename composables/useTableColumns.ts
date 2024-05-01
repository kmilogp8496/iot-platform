import { ref } from 'vue'

export type UTableColumn = {
  [key: string]: any
  key: string
  sortable?: boolean | undefined
  sort?: ((a: any, b: any, direction: 'asc' | 'desc') => number) | undefined
  direction?: 'asc' | 'desc' | undefined
  class?: string | undefined
}

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
  truncate?: string
}

export function useTableColumns<T extends Record<string, any>>(columns: TableColumn<T>[]) {
  return ref(columns)
}
