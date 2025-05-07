<script
  setup
  lang="ts"
>
  import { useAppStore } from '@/stores/app.ts'
  import { useMapStore } from '@/stores/map.ts'

  const appStore = useAppStore()
  const mapStore = useMapStore()
</script>

<template>
  <Teleport to="#header-actions">
    <v-btn
      variant="flat"
      @click="appStore.showDrawer = !appStore.showDrawer"
    >
      <template v-slot:prepend>
        <v-badge
          :model-value="mapStore.placeTypeFilter.length < 3"
          dot
          color="red"
        >
          <v-icon icon="mdi-filter" />
        </v-badge>
      </template>

      {{ $t('filters') }}
    </v-btn>
  </Teleport>
</template>
