<script
  setup
  lang="ts"
>
  import type { MarkerItem } from '@/ts/types/map.ts'
  import type { Place } from '@/ts/types/place.ts'
  import type { User } from '@/ts/types/user.ts'
  import {
    ref, shallowRef, useTemplateRef, computed, watch,
    defineAsyncComponent, onErrorCaptured, onMounted, nextTick,
  } from 'vue'
  import { useI18n } from 'vue-i18n'
  import L from 'leaflet'
  import { useMapStore } from '@/stores/map.ts'
  import { mapService } from '@/services/map.service.ts'
  import { debounceFn } from '@/utils/debounce.ts'

  import MapFilters from '@/components/map/filters/MapFilters.vue'
  import AppPage from '@/components/app/AppPage.vue'
  import MapMarkerModalAddFloatingActivator
    from '@/components/map/marker-modal/MapMarkerModalAddFloatingActivator.vue'

  /**
   * Lazy-loaded components to improve initial load performance
   */
  const LazyMapMarkerModalInfo = defineAsyncComponent({
    loader: () => import('@/components/map/marker-modal/MapMarkerModalInfo.vue'),
    // Add error handling for async component loading
    onError: (error, retry, fail) => {
      console.error('Error loading MapMarkerModalInfo component:', error)
      fail()
    },
  })

  const LazyMapMarkerModalAdd = defineAsyncComponent({
    loader: () => import('@/components/map/marker-modal/MapMarkerModalAdd.vue'),
    onError: (error, retry, fail) => {
      console.error('Error loading MapMarkerModalAdd component:', error)
      fail()
    },
  })

  const INITIAL_ZOOM = 14
  const MARKERS_UPDATE_DEBOUNCE_MS = 500

  const { locale } = useI18n()
  const mapStore = useMapStore()

  const mapRef = useTemplateRef('mapRef')
  const map = shallowRef<L.Map | undefined>()
  const selectedPlace = ref<Place | null>(null)
  const selectedUser = ref<User | null>(null)
  const selectedCoordinates = ref<L.LatLngLiteral | null>(null)
  const showMarkerInfoForm = ref<boolean>(false)
  const showMarkerAddingForm = ref<boolean>(false)
  const nearestUsers = ref<User[]>([])

  /**
   * Computed property that handles the currently selected marker (either a place or a user)
   * and ensures that only one type of marker can be selected at a time.
   */
  const selectedMarker = computed<MarkerItem | null>({
    get() {
      return selectedUser.value || selectedPlace.value
    },
    set(value) {
      if (!value) {
        selectedPlace.value = null
        selectedUser.value = null

        return
      }

      if (mapService.isPlaceMarker(value)) {
        selectedUser.value = null
        selectedPlace.value = value
      } else {
        selectedUser.value = value
      }
    },
  })

  /**
   * Handles map click events by storing the clicked coordinates and showing the marker adding form.
   *
   * @param event - The Leaflet mouse event containing the clicked coordinates
   */
  const onMapClick = (event: L.LeafletMouseEvent): void => {
    selectedCoordinates.value = event.latlng
    showMarkerAddingForm.value = true
  }

  /**
   * Handles marker click events.
   *
   * @param markerItem - The marker item that was clicked
   */
  const onMarkerClick = (markerItem: MarkerItem): void => {
    if (selectedMarker.value?.id === markerItem.id) {
      showMarkerInfoForm.value = true

      return
    }

    setSelectedMarker(markerItem)
  }

  /**
   * Finds and displays the nearest users to the given coordinates.
   *
   * @param latLng - The coordinates to find nearest users for
   */
  const showNearestUsers = (latLng: L.LatLngTuple): void => {
    nearestUsers.value = mapService.getNearestUsers(mapStore.users, latLng)
  }

  /**
   * Sets the selected marker and shows the marker info form.
   * If the marker is a place, it also shows the nearest users to that place.
   *
   * @param markerItem - The marker item to select
   */
  const setSelectedMarker = (markerItem: MarkerItem): void => {
    selectedMarker.value = markerItem
    showMarkerInfoForm.value = true

    if (mapService.isPlaceMarker(markerItem)) {
      showNearestUsers(markerItem.coordinates)
    }
  }

  /**
   * Clears the currently selected marker and resets the nearest users list.
   */
  const clearSelectedMarker = (): void => {
    selectedMarker.value = null

    nearestUsers.value = []
  }

  /**
   * Updates all markers on the map based on the current state.
   * This function is debounced to prevent too frequent updates.
   */
  const updateMarkers = debounceFn(() => {
    if (!map.value) {
      return
    }

    try {
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
        selectedPlace.value,
      )
    } catch (error) {
      console.error('Error updating markers:', error)
    }
  }, MARKERS_UPDATE_DEBOUNCE_MS)

  /**
   * Closes the marker info modal.
   */
  const closeMarkerModalInfo = (): void => {
    showMarkerInfoForm.value = false
  }

  /**
   * Initializes the map if it hasn't been initialized yet.
   * Sets up the tile layer, event listeners, and initial markers.
   */
  const initMap = (): void => {
    if (map.value) {
      return
    }

    if (!mapRef.value) {
      console.error('Map reference element not found')

      return
    }

    try {
      map.value = L
        .map(mapRef.value)
        .setView(mapStore.initialLocation, INITIAL_ZOOM)

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.value)

      map.value.on('click', onMapClick)

      updateMarkers()
    } catch (error) {
      console.error('Error initializing map:', error)
    }
  }

  /**
   * Closes the marker adding form and clears the selected coordinates.
   */
  const closeMarkerAddingForm = (): void => {
    selectedCoordinates.value = null
    showMarkerAddingForm.value = false
  }

  /**
   * Creates a new marker from the given place data, adds it to the store,
   * closes the adding form, selects the new marker, and updates all markers.
   *
   * @param place - The place data for the new marker
   */
  const createMarker = (place: Place): void => {
    try {
      mapStore.addPlace(place)

      closeMarkerAddingForm()

      onMarkerClick(place)

      updateMarkers()
    } catch (error) {
      console.error('Error creating marker:', error)
    }
  }

  // Global error handler for the component
  onErrorCaptured((error) => {
    console.error('Error captured in MapView:', error)

    return false // prevent propagation
  })

  onMounted(() => {
    // Initialize the map when data is loaded
    const stopWatcher = watch(() => mapStore.isDataLoaded, (value) => {
      if (!value) {
        return
      }

      initMap()

      nextTick(() => stopWatcher())
    }, { immediate: true })
  })

  // Update markers when relevant data changes
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
      @close="closeMarkerModalInfo()"
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
