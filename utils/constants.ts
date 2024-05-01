export const RolesDefinition = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
  SENSOR: 'SENSOR',
} as const

export type UserRoles = typeof RolesDefinition[keyof typeof RolesDefinition]

export const TIME_AGO_DEFAULT_MESSAGES = {
  messages: {
    justNow: 'Justo ahora',
    past: (n: any) => n.match(/\d/) ? `hace ${n}` : n,
    future: (n: any) => n.match(/\d/) ? `en ${n}` : n,
    month: (n: any, past: boolean) => n === 1
      ? past
        ? 'último mes'
        : 'próximo mes'
      : `${n} mes${n > 1 ? 's' : ''}`,
    year: (n: any, past: boolean) => n === 1
      ? past
        ? 'último año'
        : 'próximo año'
      : `${n} año${n > 1 ? 's' : ''}`,
    day: (n: any, past: boolean) => n === 1
      ? past
        ? 'ayer'
        : 'mañana'
      : `${n} día${n > 1 ? 's' : ''}`,
    week: (n: any, past: boolean) => n === 1
      ? past
        ? 'última semana'
        : 'próxima semana'
      : `${n} semana${n > 1 ? 's' : ''}`,
    hour: (n: any) => `${n} hora${n > 1 ? 's' : ''}`,
    minute: (n: any) => `${n} minuto${n > 1 ? 's' : ''}`,
    second: (n: any) => `${n} segundo${n > 1 ? 's' : ''}`,
    invalid: '',
  },
}

export const ICONS = {
  sensorConfiguration: 'i-carbon-settings-edit',
  refresh: 'material-symbols:sync-rounded',
  text: 'i-carbon-string-text',
  create: 'i-heroicons-plus',
  edit: 'i-heroicons-pencil',
  delete: 'i-heroicons-trash',
  cancel: 'i-heroicons-x-circle',
  confirm: 'i-heroicons-check',
  message: 'i-material-symbols-chat-paste-go-outline',
  notification: 'i-heroicons-bell',
  test: 'i-heroicons-play',
} as const
