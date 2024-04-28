<script setup lang="ts">
import type { z } from 'zod'
import { notificationLevels, notificationTypes, type notificationsSchema } from './notifications.const'

type State = z.infer<typeof notificationsSchema>

const state = defineModel<State>('state', { required: true })
</script>

<template>
  <UFormGroup
    label="Nombre"
    name="name"
  >
    <UInput
      v-model="state.name"
      placeholder="Nombre de la notificación"
      :icon="ICONS.text"
    />
  </UFormGroup>
  <UFormGroup
    label="Mensaje"
    name="message"
  >
    <UTextarea
      v-model="state.message"
      placeholder="Mensaje de la notificación"
      :icon="ICONS.text"
    />
  </UFormGroup>
  <UFormGroup
    label="Nivel"
    name="level"
  >
    <USelectMenu
      v-model="state.level"
      :options="notificationLevels"
      placeholder="Nivel de la notificación"
      trailing
    />
  </UFormGroup>
  <UFormGroup
    label="Tipo"
    name="type"
  >
    <USelectMenu
      v-model="state.type"
      :options="notificationTypes"
      placeholder="Tipo de notificación"
      trailing
    />
  </UFormGroup>
  <UFormGroup
    label="URL"
    name="url"
  >
    <UInput
      v-model="state.url"
      placeholder="URL"
      trailing
    />
  </UFormGroup>
  <UFormGroup
    label="Descripción"
    name="description"
  >
    <UTextarea
      v-model="state.description"
      placeholder="Descripción"
      :icon="ICONS.text"
    />
  </UFormGroup>
</template>
