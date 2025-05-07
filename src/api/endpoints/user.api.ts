import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { User } from '@/ts/types/user'

/**
 * User API
 *
 * @param fetch
 */
export default (fetch: AxiosInstance) => ({
  all(config?: AxiosRequestConfig) {
    return fetch<User[]>('https://jsonplaceholder.typicode.com/users', config)
  },
})
