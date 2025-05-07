<script
  setup
  lang="ts"
>
  import { useAppStore } from '@/stores/app.ts'

  import TheHeader from '@/components/TheHeader.vue'
  import TheFooter from '@/components/TheFooter.vue'
  import TheLoader from '@/components/TheLoader.vue'
  import TheDrawer from '@/components/TheDrawer.vue'

  const appStore = useAppStore()
</script>

<template>
  <v-responsive>
    <v-app>
      <Transition name="fade-transition">
        <TheLoader
          v-if="appStore.showLoader"
          key="loader"
        />
      </Transition>

      <v-layout key="layout">
        <TheHeader />

        <TheDrawer />

        <Suspense>
          <slot />
        </Suspense>

        <TheFooter key="footer" />
      </v-layout>
    </v-app>
  </v-responsive>
</template>
