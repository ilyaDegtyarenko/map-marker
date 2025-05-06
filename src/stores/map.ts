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
    lat: 0,
    lng: 0,
  })

  const isDataLoaded = computed<boolean>(() => {
    return Boolean(
      places.value.length &&
        users.value.length &&
        initialLocation.value.lat &&
        initialLocation.value.lng
    )
  })

  return {
    places,
    placeTypeFilter,
    users,
    initialLocation,

    isDataLoaded,
  }
})
