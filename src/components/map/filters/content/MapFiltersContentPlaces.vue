<script
  setup
  lang="ts"
>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useMapStore } from '@/stores/map.ts'
  import { mapService } from '@/services/map.service.ts'

  const { t } = useI18n()
  const mapStore = useMapStore()

  const placeTypeOptions = computed(() => {
    return mapService.getPlaceTypeOptions(t)
  })
</script>

<template>
  <v-list-subheader>
    {{ $t('places') }}
  </v-list-subheader>

  <v-list-item
    v-for="item in placeTypeOptions"
    :key="item.value"
  >
    <v-checkbox
      v-model="mapStore.placeTypeFilter"
      :label="item.title"
      :value="item.value"
      hide-details
    />
  </v-list-item>
</template>
