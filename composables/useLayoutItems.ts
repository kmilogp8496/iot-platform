import type { AccordionItem, VerticalNavigationLink } from '#ui/types'
import { NAVIGATION_LINKS } from '~/components/layout/navigationitems'

export const useLayoutItems = async () => {
  const { data: navigation } = useAsyncData(() => queryContent('/docs').limit(100).find(), {
    transform: data => data.map(item => ({
      label: item?.title ?? '',
      to: item?._path,
      icon: 'i-heroicons-cpu-chip',
    })),
  })

  const accordionItems = computed<(AccordionItem & { items?: VerticalNavigationLink[] })[]>(() => [
    {
      label: 'Plataforma',
      icon: 'i-heroicons-cube',
      items: NAVIGATION_LINKS,
      variant: 'ghost',
      defaultOpen: true,
    },
    {
      label: 'Documentación',
      icon: 'i-heroicons-document-text',
      items: navigation.value ?? [],
      variant: 'ghost',
      to: '/docs',
      defaultOpen: true,
    },
  ])

  return {
    accordionItems,
  }
}
