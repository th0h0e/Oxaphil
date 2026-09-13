import { definePerson } from "nuxt-schema-org/schema";
import appMeta from "./app/app.meta";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
   '@nuxt/eslint',
   '@nuxt/image',
   '@nuxt/ui',
   '@nuxtjs/seo',
   'nuxt-schema-org',
   '@nuxt/content',
   '@vueuse/nuxt',
   'nuxt-og-image',
   'motion-v/nuxt',
   'nuxt-studio',
   '@nuxt/hints',
   '@compodium/nuxt'
  ],

  devtools: {
    enabled: true
  },
  devServer: {
        port: 3001,
    },

  css: ['~/assets/css/main.css'],

  site: {
    url: appMeta.url,
    name: appMeta.name,
    defaultLocale: "de",
    env: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  },
  schemaOrg: {
      identity: definePerson(appMeta.author),
  },

  // Nuxt OG Image reads these to render the OG image in a non-`system` mode.
  colorMode: {
    preference: 'system',
    fallback: 'light'
  },

  content: {
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
    },
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
    },
    git: {
      commit: {
        messagePrefix: 'content:'
      }
    }
  }
})
