import type L from 'leaflet'
import type { Place } from '@/ts/types/place.ts'
import type { User } from '@/ts/types/user.ts'
import type { PlaceTypeEnum } from '@/ts/enums/place.ts'

export type MarkerItem = Place | User

export type MarkerData = {
  type: PlaceTypeEnum | 'user'
  name: string
  coordinates: L.LatLngTuple
  icon: L.Icon
}

export type PlaceTypeOption = {
  title: string
  value: PlaceTypeEnum
}
