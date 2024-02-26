<script lang="ts" setup generic="T extends Record<string, any>">
const props = defineProps<{
  rows: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  total: number
}>()

const page = defineModel('page', {
  default: 1,
})

const limit = defineModel('limit', {
  default: 5,
})

const transformableColumns = computed(() => props.columns.filter(column => Boolean(column.transform)))
</script>

<template>
  <div v-if="$slots.header" class="flex py-4 items-center">
    <slot name="header" />
  </div>
  <UTable :rows="rows" :columns="columns" :loading="loading">
    <template v-for="column in transformableColumns" :key="`transformed-${column.key}`" #[`${column.key}-data`]="{ row }">
      {{ column.transform?.(row) }}
    </template>

    <template v-for="(_, name) in $slots" :key="`slot-${name}`" #[name]="{ row }">
      <slot :name="name" :row="row" />
    </template>
  </UTable>
  <div class="flex justify-end items-center gap-4 mt-4">
    <span> Total: {{ total }} </span> <UPagination v-model="page" :page-count="limit" :total="total" />
  </div>
</template>

<style>

</style>
