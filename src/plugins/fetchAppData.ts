import { useAppStore } from '@/stores/app.ts'
import { useMapStore } from '@/stores/map.ts'
import { mapService } from '@/services/map.service.ts'
import { userService } from '@/services/user.service.ts'

/**
 * An asynchronous function that initializes the application state by fetching places and users data,
 * and then updates the corresponding store objects.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the state initialization is complete.
 */
export default async (): Promise<void> => {
  const appStore = useAppStore()
  const mapStore = useMapStore()

  const { data: places } = await mapService.getAllPlaces()
  const { data: users } = await userService.getAll()

  mapStore.places = places
  mapStore.users = users

  appStore.showLoader = false
}
