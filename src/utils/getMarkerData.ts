import type { MarkerItem } from '@/ts/types/map.ts'
import type { PlaceTypeEnum } from '@/ts/enums/place.ts'
import L from 'leaflet'
import { isUserMarker } from '@/utils/isUserMarker.ts'

type MarkerData = {
  type: PlaceTypeEnum | 'user'
  name: string
  coordinates: L.LatLngTuple
  icon: L.Icon
}

export const getMarkerData = (markerItem: MarkerItem): MarkerData => {
  const icon: L.IconOptions = {
    iconUrl: '/img/marker-person.png',
    iconSize: [ 32, 32 ],
    iconAnchor: [ 16, 32 ],
    popupAnchor: [ 0, -32 ],
    shadowUrl: '/img/marker-shadow.png',
    shadowSize: [ 41, 41 ],
    shadowAnchor: [ 13, 41 ],
  }

  if (isUserMarker(markerItem)) {
    return {
      type: 'user',
      name: markerItem.name,
      coordinates: [
        parseFloat(markerItem.address.geo.lat),
        parseFloat(markerItem.address.geo.lng),
      ],
      icon: L.icon(icon),
    }
  }

  icon.iconUrl = `/img/marker-${ markerItem.type }.png`

  return {
    type: markerItem.type,
    name: markerItem.name,
    coordinates: markerItem.coordinates,
    icon: L.icon(icon),
  }
}
