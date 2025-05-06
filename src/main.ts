import './assets/styles/css/libs.css'
import './assets/styles/sass/main.sass'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import i18n from '@/plugins/i18n.ts'
import pinia from '@/plugins/pinia.ts'
import vuetify from '@/plugins/vuetify.ts'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(pinia)
app.use(vuetify)

app.mount('#app')
