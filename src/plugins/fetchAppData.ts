import { useAppStore } from '@/stores/app.ts'
import { useMapStore } from '@/stores/map.ts'
import { useApi } from '@/composables/useApi.ts'

export default async (): Promise<void> => {
  const appStore = useAppStore()
  const mapStore = useMapStore()

  const { data: dataHandshake } = await useApi().auth.handshake()
  const { data: dataUser } = await useApi().user.all()

  mapStore.initialLocation = dataHandshake.initialLocation
  mapStore.places = dataHandshake.places
  mapStore.users = dataUser

  appStore.showLoader = false
}
