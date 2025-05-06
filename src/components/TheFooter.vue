<script
  setup
  lang="ts"
>
  import { computed } from 'vue'

  const appTitle = import.meta.env.VITE_APP_TITLE

  const fullYear = computed<number>(() => {
    return new Date().getFullYear()
  })
</script>

<template>
  <v-footer
    app
    class="justify-center !z-[1001]"
  >
    <div>
      {{ fullYear }} — <span>{{ appTitle }}</span>
    </div>
  </v-footer>
</template>
