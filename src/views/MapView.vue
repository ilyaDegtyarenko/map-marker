<script
  setup
  lang="ts"
>
  import type { MarkerItem } from '@/ts/types/map.ts'
  import type { Place } from '@/ts/types/place.ts'
  import type { User } from '@/ts/types/user.ts'
  import { defineAsyncComponent, ref, shallowRef, useTemplateRef, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useMapStore } from '@/stores/map.ts'
  import L from 'leaflet'
  import MapFilters from '@/components/map/MapFilters.vue'
  import AppPage from '@/components/app/AppPage.vue'
  import MapMarkerModalAddFloatingActivator
    from '@/components/map/MapMarkerModalAddFloatingActivator.vue'
  import { debounceFn } from '@/utils/debounce.ts'
  import { getMarkerData } from '@/utils/getMarkerData.ts'
  import { isPlaceMarker } from '@/utils/isPlaceMarker.ts'

  const LazyMapMarkerModalInfo = defineAsyncComponent(
    () => import('@/components/map/MapMarkerModalInfo.vue'),
  )

  const LazyMapMarkerModalAdd = defineAsyncComponent(
    () => import('@/components/map/MapMarkerModalAdd.vue'),
  )

  const INITIAL_ZOOM = 14

  const { locale } = useI18n()

  const mapRef = useTemplateRef('mapRef')
  const map = shallowRef<L.Map | undefined>()

  const mapStore = useMapStore()

  const selectedMarker = ref<MarkerItem | null>(null)
  const selectedCoordinates = ref<L.LatLngLiteral | null>(null)
  const showMarkerAddingForm = ref<boolean>(false)
  const nearbyUsers = ref<User[]>([])

  const onMapClick = (event: L.LeafletMouseEvent): void => {
    selectedCoordinates.value = event.latlng
    showMarkerAddingForm.value = true
  }

  const onMarkerClick = (markerItem: MarkerItem): void => {
    selectedMarker.value = markerItem

    if (isPlaceMarker(markerItem)) {
      showNearbyUsers(markerItem.coordinates)
    }
  }

  const addMarker = (markerItem: MarkerItem, active = false): void => {
    const markerData = getMarkerData(markerItem, active)

    const marker = L
      .marker(markerData.coordinates, { icon: markerData.icon })
      .addTo(map.value!)

    marker.on('click', () => onMarkerClick(markerItem))
  }

  const showNearbyUsers = (latLng: L.LatLngTuple): void => {
    const point = L.latLng(latLng)

    const userPoints = mapStore.users.map((user) => {
      return {
        user,
        latLng: L.latLng(user.address.geo),
      }
    })

    userPoints.sort((a, b) => {
      return point.distanceTo(a.latLng) - point.distanceTo(b.latLng)
    })

    nearbyUsers.value = userPoints.slice(0, 3).map(({ user }) => user)
  }

  const updateMarkers = debounceFn(() => {
    if (!map.value) {
      return
    }

    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.value!.removeLayer(layer)
      }
    })

    mapStore.places
      .filter((place) => mapStore.placeTypeFilter.includes(place.type))
      .forEach((place) => addMarker(place, selectedMarker.value?.id === place.id))

    nearbyUsers.value.forEach((user) => addMarker(user, true))
  }, 500)

  const initMap = (): void => {
    if (map.value) {
      return
    }

    map.value = L
      .map(mapRef.value!)
      .setView([
        mapStore.initialLocation.lat,
        mapStore.initialLocation.lng,
      ], INITIAL_ZOOM)

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

  const createMarker = (place: Place): void => {
    mapStore.addPlace(place)

    closeMarkerAddingForm()

    onMarkerClick(place)

    updateMarkers()
  }

  const closeMarkerAddingForm = (): void => {
    selectedCoordinates.value = null
    showMarkerAddingForm.value = false
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
    nearbyUsers,
    () => mapStore.placeTypeFilter,
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
        v-if="!showMarkerAddingForm && !selectedMarker"
        key="form-activator"
        @open="showMarkerAddingForm = true"
      />
    </Transition>

    <LazyMapMarkerModalInfo
      v-if="selectedMarker"
      key="marker-modal-info"
      v-model:item="selectedMarker"
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
