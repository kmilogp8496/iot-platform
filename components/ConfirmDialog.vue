<script lang="ts" setup>
const props = withDefaults(defineProps<{
  content: string
  color?: string
  title?: string
  onSuccess?: () => MaybePromise<boolean>
  onReject?: () => MaybePromise<boolean>
}>(), {
  color: 'red',
  title: 'Confirmar',
})

const model = ref(false)
const loading = ref(false)

async function onSuccess() {
  loading.value = true
  try {
    const success = await props.onSuccess?.()
    loading.value = false

    if (success === false)
      return
  }
  finally {
    loading.value = false
  }

  model.value = false
}

async function onReject() {
  loading.value = true
  try {
    const success = await props.onReject?.()
    loading.value = false

    if (success === false)
      return
  }
  finally {
    loading.value = false
  }

  model.value = false
}

function onClick() {
  model.value = true
}
</script>

<template>
  <slot name="activator" :on="{ onClick }" />
  <UModal v-model="model">
    <UCard>
      <template #header>
        <slot name="title">
          <h4 class="text-xl font-semibold">
            {{ title }}
          </h4>
        </slot>
      </template>

      <slot>
        {{ content }}
      </slot>

      <template #footer>
        <div class="flex gap-4 justify-end">
          <UButton :icon="ICONS.cancel" variant="outline" :loading="loading" label="Cancelar" @click="onReject" />
          <UButton :icon="ICONS.confirm" :loading="loading" label="Confirmar" :color="color" @click="onSuccess" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
