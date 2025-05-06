import { PlaceTypeEnum } from '../enums/place'
import type { LatLngTuple } from 'leaflet'

export type Place = {
  id: number
  name: string
  type: PlaceTypeEnum
  coordinates: LatLngTuple
}
