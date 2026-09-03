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
  label: 'Press',
  icon: 'i-lucide-newspaper',
  to: '/press'
}, {
  label: 'Materialien',
  icon: 'i-lucide-layers',
  to: '/materialien'
}, {
  label: 'Bestellen',
  icon: 'i-lucide-shopping-cart',
  to: '/bestellung'
}]

// Temporarily hidden while we test whether /press can replace /neuigkeiten.
// The route itself still works — only the nav entry is removed.
// {
//   label: 'Presse',
//   icon: 'i-lucide-newspaper',
//   to: '/press'
// }
