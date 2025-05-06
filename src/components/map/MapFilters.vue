<script
  setup
  lang="ts"
>
  import { useAppStore } from '@/stores/app.ts'
  import { useMapStore } from '@/stores/map.ts'
  import { getPlaceTypeOptions } from '@/utils/getPlaceTypeOptions.ts'

  const appStore = useAppStore()
  const mapStore = useMapStore()

  const placeTypeOptions = getPlaceTypeOptions()
</script>

<template>
  <Teleport to="#header-actions">
    <v-btn
      variant="flat"
      @click="appStore.showDrawer = !appStore.showDrawer"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-filter" />
      </template>

      {{ $t('filters') }}
    </v-btn>
  </Teleport>

  <Teleport to="#drawer-content">
    <v-list
      v-model:selected="mapStore.placeTypeFilter"
      multiple select-strategy="classic"
    >
      <v-list-subheader>
        {{ $t('places') }}
      </v-list-subheader>

      <v-list-item
        v-for="item in placeTypeOptions"
        :key="item.value"
        :value="item.value"
        :active="false"
      >
        <v-checkbox
          v-model="mapStore.placeTypeFilter"
          :label="item.title"
          :value="item.value"
          hide-details
        />
      </v-list-item>

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
