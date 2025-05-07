<script
  setup
  lang="ts"
>
  import { useMapStore } from '@/stores/map.ts'

  const mapStore = useMapStore()
</script>

<template>
  <v-list-subheader>
    {{ $t('people') }}
  </v-list-subheader>

  <v-list-item>
    <v-switch
      v-model="mapStore.userShowAllFilter"
      :label="$t('show-all')"
      hide-details
    />
  </v-list-item>
</template>
