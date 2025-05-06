import { createI18n } from 'vue-i18n'
import uk from '@/locales/uk.json'
import en from '@/locales/en.json'

export default createI18n({
  legacy: false,
  locale: String(localStorage.getItem('userLang') || 'uk'),
  fallbackLocale: 'en',
  messages: { uk, en },
})
