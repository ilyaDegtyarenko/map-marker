import type { MarkerItem } from '@/ts/types/map.ts'
import type { User } from '@/ts/types/user.ts'

export const isUserMarker = (markerItem: MarkerItem): markerItem is User => {
  return (markerItem as User).address !== undefined
}
