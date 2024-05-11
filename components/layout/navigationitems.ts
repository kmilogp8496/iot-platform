import type { VerticalNavigationLink } from '#ui/types'

export const NAVIGATION_LINKS: VerticalNavigationLink[] = [
  {
    label: 'Dashboard',
    icon: ICONS.dashboard,
    to: '/dashboard',
  },
  {
    label: 'Proyectos',
    icon: 'i-heroicons-chart-bar',
    to: '/projects',
  },
  {
    label: 'Sensores',
    icon: ICONS.sensors,
    to: '/sensors',
  },
  {
    label: 'Variables',
    icon: 'mdi:variable',
    to: '/variables',
  },
  {
    label: 'Ubicaciones',
    icon: 'mdi:map-marker',
    to: '/locations',
  },
  {
    label: 'Notificaciones',
    icon: ICONS.notification,
    to: '/notifications',
  },
  {
    label: 'OTA',
    icon: ICONS.OTA,
    to: '/wip/OTA',
    badge: {
      label: 'WIP',
      color: 'primary',
      variant: 'soft',
    },
  },
  {
    label: 'Pregunta a la IA',
    icon: ICONS.IA,
    to: '/wip/IA',
    badge: {
      label: 'WIP',
      color: 'primary',
      variant: 'soft',
    },
  },
] as const
