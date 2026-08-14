import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/projects'
}, {
  label: 'Blog',
  icon: 'i-lucide-file-text',
  to: '/blog'
}, {
  label: 'Speaking',
  icon: 'i-lucide-mic',
  to: '/speaking'
}, {
  label: 'Wir',
  icon: 'i-lucide-users',
  to: '/wir'
}, {
  label: 'Willkommen',
  icon: 'i-lucide-house',
  to: '/landing'
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
}]
