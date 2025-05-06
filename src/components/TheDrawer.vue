<script
  setup
  lang="ts"
>
  import { useAppStore } from '@/stores/app.ts'

  const appStore = useAppStore()
</script>

<template>
  <v-navigation-drawer
    v-model="appStore.showDrawer"
    temporary
    :scrim="false"
    location="right"
    class="!z-[1001]"
  >
    <div
      id="drawer-content"
      class="[&:empty]:hidden"
    ></div>
  </v-navigation-drawer>
</template>
