<script
  setup
  lang="ts"
>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAppStore } from '@/stores/app.ts'
  import { useMapStore } from '@/stores/map.ts'
  import { mapService } from '@/services/map.service.ts'

  const { t } = useI18n()
  const appStore = useAppStore()
  const mapStore = useMapStore()

  const placeTypeOptions = computed(() => {
    return mapService.getPlaceTypeOptions(t)
  })
</script>

<template>
  <Teleport to="#header-actions">
    <v-btn
      variant="flat"
      @click="appStore.showDrawer = !appStore.showDrawer"
    >
      <template v-slot:prepend>
        <v-badge
          color="red"
          dot
          :model-value="mapStore.placeTypeFilter.length < 3"
        >
          <v-icon icon="mdi-filter" />
        </v-badge>
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
