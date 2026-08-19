import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Wir',
  icon: 'i-lucide-users',
  to: '/wir'
}, {
  label: 'Neuigkeiten',
  icon: 'i-lucide-newspaper',
  to: '/neuigkeiten'
}, {
  label: 'Materialien',
  icon: 'i-lucide-layers',
  to: '/materialien'
}, {
  label: 'Bestellen',
  icon: 'i-lucide-shopping-cart',
  to: '/bestellung'
}, {
  label: 'Presse',
  icon: 'i-lucide-newspaper',
  to: '/press'
}, {
  label: 'Speaking',
  icon: 'i-lucide-mic',
  to: '/speaking'
}]
