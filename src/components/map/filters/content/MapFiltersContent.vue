<script
  setup
  lang="ts"
>
  import { useMapStore } from '@/stores/map.ts'

  import MapFiltersContentPlaces from '@/components/map/filters/content/MapFiltersContentPlaces.vue'
  import MapFiltersContentUsers from '@/components/map/filters/content/MapFiltersContentUsers.vue'

  const mapStore = useMapStore()
</script>

<template>
  <Teleport to="#drawer-content">
    <v-list>
      <MapFiltersContentPlaces />

      <v-divider class="mb-2"/>

      <MapFiltersContentUsers />

      <v-divider class="mb-4" />

      <v-list-item>
        <v-btn
          block
          variant="tonal"
          @click="mapStore.resetFilters()"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-refresh" />
          </template>

          {{ $t('reset') }}
        </v-btn>
      </v-list-item>
    </v-list>
  </Teleport>
</template>
