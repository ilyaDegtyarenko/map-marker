import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { Place } from '@/ts/types/place.ts'

/**
 * Place API
 *
 * @param fetch
 */
export default (fetch: AxiosInstance) => ({
  all(config?: AxiosRequestConfig) {
    return fetch<Place[]>('/data/places.json', config)
  },
})
