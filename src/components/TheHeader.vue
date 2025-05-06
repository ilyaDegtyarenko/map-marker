<script
  setup
  lang="ts"
>
  import AppLanguageSwitcher from '@/components/app/AppLanguageSwitcher.vue'

  const appTitle = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <v-app-bar app>
    <v-toolbar-title>
      {{ appTitle }}
    </v-toolbar-title>

    <v-spacer />

    <div class="flex items-center gap-2 mr-5">
      <div
        id="header-actions"
        class="[&:empty]:hidden"
      ></div>

      <AppLanguageSwitcher />
    </div>
  </v-app-bar>
</template>
