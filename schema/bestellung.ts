import { property, z } from '@nuxt/content'
import { lockPageMeta } from './shared'

const createButtonSchema = () => z.object({
  label: z.string().editor({ label: 'Beschriftung' }),
  icon: z.string().optional().editor({ label: 'Symbol' }),
  to: z.string().optional().editor({ label: 'Link-Ziel' }),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional().editor({ label: 'Farbe' }),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional().editor({ label: 'Größe' }),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional().editor({ label: 'Variante' }),
  target: z.enum(['_blank', '_self']).optional().editor({ label: 'Öffnen in' })
})

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media', label: 'Bilddatei' }),
  alt: z.string().editor({ label: 'Alternativtext', tooltip: 'Bildbeschreibung für Screenreader und Suchmaschinen' })
})

export const bestellungSchema = z.object({
  ...lockPageMeta(),
  content: z.string().editor({ input: 'textarea', label: 'Einleitungstext' }),
  // `email` renders the button as a mailto: link (falling back to the
  // app-config address when blank), mirroring the hero link on index.yml.
  links: z.array(createButtonSchema().extend({
    email: z.string().optional().editor({ label: 'E-Mail-Adresse', description: 'Statt eines Link-Ziels: erzeugt einen mailto:-Link' })
  })).editor({ label: 'Buttons' }),
  // Shape is read from ContactCard.vue's props rather than declared here, so
  // adding a prop to that component is enough to expose it in Studio.
  // `.inherit()` replaces the field's editor options, so this one field's
  // label stays auto-generated; its German sub-labels come from the JSDoc
  // comments on ContactCard.vue's props.
  contactCard: property(z.object({})).inherit('app/components/ContactCard.vue')
})

export const bestellungProductSchema = z.object({
  title: z.string().editor({ label: 'Abschnittstitel' }),
  name: z.string().editor({ label: 'Produktname' }),
  chemicalName: z.string().editor({ label: 'Chemische Bezeichnung' }),
  specs: z.array(z.object({
    label: z.string().editor({ label: 'Bezeichnung' }),
    value: z.string().editor({ label: 'Wert' })
  })).editor({ label: 'Technische Daten' }),
  price: z.string().editor({ label: 'Preis' }),
  image: createImageSchema().editor({ label: 'Produktbild' })
})
