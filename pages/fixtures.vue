<script setup lang="ts">
const consult = useFetch('/api/fixtures', {
  method: 'get',
})

const createFixtures = useFetch('/api/fixtures', {
  method: 'post',
  immediate: false,
})

const toast = useToast()

async function onClick() {
  await createFixtures.execute()
  if (!createFixtures.error.value) {
    toast.add({
      title: 'Fixture generated',
      description: 'The fixture has been generated successfully',
    })
  }

  consult.refresh()
}
</script>

<template>
  <UButton
    :loading="createFixtures.status.value === 'pending'"
    @click="onClick"
  >
    Generate Fixture
  </UButton>
</template>
