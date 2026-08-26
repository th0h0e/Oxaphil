// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt',
    'nuxt-studio',
    '@nuxt/hints',
    '@nuxthub/core'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://th0h0e-oxaphil.th0h0e.workers.dev',
    name: 'Oxaphil',
    env: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  },

  // Nuxt OG Image reads these to render the OG image in a non-`system` mode.
  colorMode: {
    preference: 'system',
    fallback: 'light'
  },

  ui: {
    theme: {
      defaultVariants: {
        size: 'sm'
      }
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    preset: "cloudflare-module",
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ogImage: {
    zeroRuntime: true,
    buildCache: true
  },

  studio: {
    route: '/admin',
    i18n: {
      defaultLocale: 'de'
    },
    editor: {
      iconLibraries: ['lucide']
    },
    repository: {
      provider: 'github', // 'github' or 'gitlab'
      owner: 'th0h0e',
      repo: 'Oxaphil',
      branch: 'main'
    }
  }
})
