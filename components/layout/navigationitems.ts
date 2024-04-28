import type { VerticalNavigationLink } from '#ui/types'

export const NAVIGATION_LINKS: VerticalNavigationLink[] = [
  {
    label: 'Dashboard',
    icon: 'i-heroicons-presentation-chart-line-solid',
    to: '/dashboard',
  },
  {
    label: 'Proyectos',
    icon: 'i-heroicons-chart-bar',
    to: '/projects',
  },
  {
    label: 'Sensores',
    icon: 'i-cbi-motion-sensor-temperature',
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
] as const
