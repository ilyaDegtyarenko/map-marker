<script
  setup
  lang="ts"
>
  import type { MarkerItem } from '@/ts/types/map.ts'
  import type { Place } from '@/ts/types/place.ts'
  import type { User } from '@/ts/types/user.ts'
  import { defineAsyncComponent, ref, shallowRef, useTemplateRef, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import L from 'leaflet'
  import { useMapStore } from '@/stores/map.ts'
  import { mapService } from '@/services/map.service.ts'
  import { debounceFn } from '@/utils/debounce.ts'

  import MapFilters from '@/components/map/filters/MapFilters.vue'
  import AppPage from '@/components/app/AppPage.vue'
  import MapMarkerModalAddFloatingActivator
    from '@/components/map/marker-modal/MapMarkerModalAddFloatingActivator.vue'

  const LazyMapMarkerModalInfo = defineAsyncComponent(
    () => import('@/components/map/marker-modal/MapMarkerModalInfo.vue'),
  )

  const LazyMapMarkerModalAdd = defineAsyncComponent(
    () => import('@/components/map/marker-modal/MapMarkerModalAdd.vue'),
  )

  const INITIAL_ZOOM = 14

  const { locale } = useI18n()

  const mapRef = useTemplateRef('mapRef')
  const map = shallowRef<L.Map | undefined>()

  const mapStore = useMapStore()

  const selectedMarker = ref<MarkerItem | null>(null)
  const selectedCoordinates = ref<L.LatLngLiteral | null>(null)
  const showMarkerInfoForm = ref<boolean>(false)
  const showMarkerAddingForm = ref<boolean>(false)
  const nearestUsers = ref<User[]>([])

  const onMapClick = (event: L.LeafletMouseEvent): void => {
    selectedCoordinates.value = event.latlng
    showMarkerAddingForm.value = true
  }

  const onMarkerClick = (markerItem: MarkerItem): void => {
    selectedMarker.value = markerItem
    showMarkerInfoForm.value = true

    if (mapService.isPlaceMarker(markerItem)) {
      showNearestUsers(markerItem.coordinates)
    }
  }

  const showNearestUsers = (latLng: L.LatLngTuple): void => {
    nearestUsers.value = mapService.getNearestUsers(mapStore.users, latLng)
  }

  const clearSelectedMarker = (): void => {
    selectedMarker.value = null

    nearestUsers.value = []
  }

  const updateMarkers = debounceFn(() => {
    if (!map.value) {
      return
    }

    mapService.clearAllMarkers(map.value)

    mapService.addMarkersToMap(
      map.value,
      mapStore.places,
      mapStore.users,
      nearestUsers.value,
      mapStore.placeTypeFilter,
      mapStore.userShowAllFilter,
      onMarkerClick,
      clearSelectedMarker,
      selectedMarker.value,
    )
  }, 500)

  const initMap = (): void => {
    if (map.value) {
      return
    }

    map.value = L
      .map(mapRef.value!)
      .setView(mapStore.initialLocation, INITIAL_ZOOM)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.value)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.value)

    map.value.on('click', onMapClick)

    updateMarkers()
  }

  const closeMarkerAddingForm = (): void => {
    selectedCoordinates.value = null
    showMarkerAddingForm.value = false
  }

  const createMarker = (place: Place): void => {
    mapStore.addPlace(place)

    closeMarkerAddingForm()

    onMarkerClick(place)

    updateMarkers()
  }

  const stopWatcher = watch(() => mapStore.isDataLoaded, (value) => {
    if (!value) {
      return
    }

    initMap()

    stopWatcher()
  }, { immediate: true })

  watch([
    locale,
    nearestUsers,
    () => mapStore.placeTypeFilter,
    () => mapStore.userShowAllFilter,
    () => mapStore.places,
  ], updateMarkers)
</script>

<template>
  <AppPage>
    <div
      key="map"
      ref="mapRef"
      class="w-full h-full"
    ></div>

    <MapFilters key="filters" />

    <Transition name="scale-transition">
      <MapMarkerModalAddFloatingActivator
        v-if="!showMarkerAddingForm && !showMarkerInfoForm"
        key="form-activator"
        @open="showMarkerAddingForm = true"
      />
    </Transition>

    <LazyMapMarkerModalInfo
      v-if="showMarkerInfoForm && selectedMarker"
      key="marker-modal-info"
      v-model:item="selectedMarker"
      :nearest-users="nearestUsers"
      @close="showMarkerInfoForm = false"
    />

    <LazyMapMarkerModalAdd
      v-if="showMarkerAddingForm"
      key="marker-modal-add"
      :coordinates="selectedCoordinates"
      @add="createMarker"
      @close="closeMarkerAddingForm()"
    />
  </AppPage>
</template>
