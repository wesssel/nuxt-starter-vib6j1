import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/tailwindcss',
    [
      '@storyblok/nuxt',
      {
        accessToken: process.env.SB_ACCESS_TOKEN,
      },
    ],
    [
      '@storyblok/nuxt-auth',
      {
        id: process.env.SB_APP_ID,
        secret: process.env.SB_APP_SECRET,
        redirect_uri: process.env.SB_APP_REDIRECT_URI,
      },
    ],
  ],
})
