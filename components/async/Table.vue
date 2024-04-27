<script lang="ts" setup generic="T extends Record<string, any>, C extends TableColumn<T>">
const props = defineProps<{
  rows: T[]
  columns: C[]
  loading?: boolean
  total: number
}>()

defineSlots<Slots>()
type DataSlots = `${C[number]['key']}-data`
type HeaderSlots = `${C[number]['key']}-header`

type Slots = {
  [key in HeaderSlots]: (props: { header: Headers }) => any
} & {
  [key in DataSlots]: (props: { row: T }) => any
} & {
  header: () => any
  [key: string]: (props: { header: Headers }) => any
}

const page = defineModel('page', {
  default: 1,
})

const limit = defineModel('limit', {
  default: 5,
})

const computedColumns = computed(() => {
  return props.columns.filter(column => !column.hidden)
})

const transformableColumns = computed(() => props.columns.filter(column => Boolean(column.transform)))
</script>

<template>
  <slot name="header" />
  <UTable
    class="border-gray-200 dark:border-gray-700 rounded border-[1px]"
    :rows="rows"
    :columns="computedColumns"
    :loading="loading"
  >
    <template
      v-for="column in transformableColumns"
      :key="`transformed-${column.key.toString()}`"
      #[`${column.key.toString()}-data`]="{ row }"
    >
      {{ column.transform?.(row) }}
    </template>

    <template
      v-for="(_, name) in $slots"
      :key="`slot-${name}`"
      #[name]="{ row }"
    >
      <slot
        :name="name"
        :row="row"
      />
    </template>
  </UTable>
  <div class="flex justify-end items-center gap-4 mt-4">
    <span> Total: {{ total }} </span> <UPagination
      v-model="page"
      :page-count="limit"
      :total="total"
    />
  </div>
</template>

<style>

</style>
