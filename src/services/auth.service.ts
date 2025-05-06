import type { AxiosInstance } from 'axios'
import type { LatLngLiteral } from 'leaflet'
import type { Place } from '@/ts/types/place.ts'

export default (fetch: AxiosInstance) => ({
  handshake() {
    return fetch<{
      initialLocation: LatLngLiteral
      places: Place[]
    }>('/data/handshake.json')
  },
})
