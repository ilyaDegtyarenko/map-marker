import './assets/styles/css/libs.css'
import './assets/styles/sass/main.sass'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import i18n from '@/plugins/i18n.ts'
import pinia from '@/plugins/pinia.ts'
import vuetify from '@/plugins/vuetify.ts'
import fetchAppData from '@/plugins/fetchAppData.ts'

// Create the Vue app instance.
const app = createApp(App)

// Register the plugins.
app.use(router)
app.use(i18n)
app.use(pinia)
app.use(vuetify)

// Fetch app data.
fetchAppData()
  .catch((error) => {
    throw new Error('Failed to fetch app data: ' + error.message)
  })

// Mount the app.
app.mount('#app')
