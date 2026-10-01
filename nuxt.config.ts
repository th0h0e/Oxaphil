import appMeta from './app/app.meta'
import { defineLocalBusiness } from 'nuxt-schema-org/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    'nuxt-studio',
    '@nuxt/hints',
    '@compodium/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: appMeta.url,
    name: appMeta.name,
    defaultLocale: 'de',
    env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    trailingSlash: false
  },

  colorMode: {
    preference: 'system',
    fallback: 'light'
  },

  content: {
    build: {
      csv: { delimiter: ';' }
    },
    experimental: {
      sqliteConnector: 'native'
    }
  },

  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'info',
        'success',
        'warning',
        'error'
      ]
    }
  },

  devServer: {
    port: 3001
  },

  compatibilityDate: '2026-08-04',

  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      autoSubfolderIndex: false
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
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

  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
    sitemap: ['/sitemap.xml']
  },

  schemaOrg: {
    identity: defineLocalBusiness(appMeta.localBusiness)
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
      provider: 'github',
      owner: 'th0h0e',
      repo: 'Oxaphil',
      branch: 'main'
    },
    git: {
      commit: {
        messagePrefix: 'content:'
      }
    }
  }
})
