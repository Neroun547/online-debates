// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', [
    "nuxt-socket-io",
    {
      sockets: [
        {
          name: "sessions",
          url: process.env.NUXT_PUBLIC_WS_HOST ?? "http://192.168.1.100:8082",
          default: true,
        },
        {
          name: "user",
          url: process.env.NUXT_PUBLIC_WS_HOST ?? "http://192.168.1.100:8082",
          default: true
        }
      ],
      server: false,
    },
  ], 'nuxt-zod-i18n', '@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json'},
      { code: 'uk', name: 'Ukrainian', file: 'uk.json' },
      { code: 'ru', language: 'Russian', file: 'ru.json' }
    ],
    defaultLocale: 'en',
    strategy: "no_prefix"
  },
  colorMode: {
    preference: 'light',
  },
  devServer: {
    port: Number(process.env.DEV_PORT),
    host: process.env.APP_HOST_NAME ?? '0.0.0.0',
  },
  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
    }
  }
})