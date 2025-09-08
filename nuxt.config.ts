import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/main.css'],
  typescript: {
    shim: false
  }
})