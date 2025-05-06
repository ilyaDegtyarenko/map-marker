import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('appStore', () => {
  const showLoader = ref<boolean>(true)
  const showDrawer = ref<boolean>(false)

  return {
    showLoader,
    showDrawer,
  }
})
