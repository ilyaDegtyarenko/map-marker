import type { LatLngLiteral } from 'leaflet'
import type { Place } from '@/ts/types/place.ts'
import type { User } from '@/ts/types/user.ts'
import { PlaceTypeEnum } from '@/ts/enums/place.ts'
import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'

export const useMapStore = defineStore('mapStore', () => {
  const places = ref<Place[]>([])
  const placeTypeFilter = ref<PlaceTypeEnum[]>(Object.values(PlaceTypeEnum))
  const users = ref<User[]>([])
  const initialLocation = shallowRef<LatLngLiteral>({
    lat: 48.46455576704108,
    lng: 35.04610776901246,
  })

  // A computed property that indicates whether the map data has been loaded.
  const isDataLoaded = computed<boolean>(() => {
    return Boolean(
      places.value.length
      && users.value.length
      && initialLocation.value.lat
      && initialLocation.value.lng,
    )
  })

  const addPlace = (place: Place): void => {
    places.value.push(place)
  }

  const resetFilters = (): void => {
    placeTypeFilter.value = Object.values(PlaceTypeEnum)
  }

  return {
    places,
    placeTypeFilter,
    users,
    initialLocation,

    isDataLoaded,

    addPlace,
    resetFilters,
  }
})
