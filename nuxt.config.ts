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
    '@nuxt/hints'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://oxaphil.pages.dev',
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

  compatibilityDate: '2026-08-04',

  nitro: {
      preset: 'cloudflare-pages',
      prerender: {
        routes: ['/'],
        crawlLinks: true
      },
      rollupConfig: {
        external: ['better-sqlite3']
      },
      cloudflare: {
        deployConfig: true,
        nodeCompat: true,
        wrangler: {
          d1_databases: [
            {
              binding: 'DB',
              database_name: 'oxaphil',
              database_id: 'dad64145-1aa2-42b0-89de-dc4d7c948752'
            }
          ]
        }
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
