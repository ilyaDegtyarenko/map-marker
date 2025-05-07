import type { User } from '@/ts/types/user.ts'
import axiosInstance from '@/api/axiosInstance.ts'
import userApi from '@/api/endpoints/user.api.ts'
import { mapService } from '@/services/map.service.ts'

export const userService = {
  /**
   * Retrieves all user data using the user API and applies a transformation
   * on the response to modify user addresses.
   *
   * @function
   * @returns A promise that resolves to an array of user objects with modified addresses.
   */
  getAll: () => {
    return userApi(axiosInstance).all({
      transformResponse: (data) => {
        return JSON.parse(data).map(userService.modifyUserAddresses)
      },
    })
  },

  /**
   * Modifies the addresses of a user by assigning new randomly generated geographical coordinates.
   * The new coordinates are generated specifically within the Dnipro region.
   *
   * @param user - The user whose address is to be modified. The object is expected to have an address property containing a geo object.
   * @returns {User} A new user object with the updated address including new geographical coordinates.
   */
  modifyUserAddresses: (user: User): User => {
    const newGeo = mapService.generateRandomGeoInDnipro()

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
  },

  /**
   * Extracts an array of user IDs from an array of user objects.
   *
   * @param users - An array of user objects.
   * @returns An array containing the IDs of the users.
   */
  getUserIds: (users: User[]): User['id'][] => {
    return users.map((user) => user.id)
  },

  /**
   * Extracts an array of users' names from an array of user objects.
   *
   * @param users - An array of user objects.
   * @returns An array containing the names of the users.
   */
  getUserNames: (users: User[]): User['name'][] => {
    return users.map((user) => user.name)
  },
}
