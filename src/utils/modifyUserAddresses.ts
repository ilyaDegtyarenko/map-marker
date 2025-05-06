import type { User } from '@/ts/types/user.ts'
import { generateRandomGeoInDnipro } from '@/utils/generateRandomGeoInDnipro.ts'

export const modifyUserAddresses = (user: User): User => {
  const newGeo = generateRandomGeoInDnipro()

  return {
    ...user,
    address: {
      ...user.address,
      geo: {
        lat: newGeo[0],
        lng: newGeo[1],
      },
    },
  }
}
