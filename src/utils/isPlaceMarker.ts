import type { MarkerItem } from '@/ts/types/map.ts'
import type { Place } from '@/ts/types/place.ts'

export const isPlaceMarker = (markerItem: MarkerItem): markerItem is Place => {
  return (markerItem as Place).coordinates !== undefined
}
