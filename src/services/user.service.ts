import type { AxiosInstance } from 'axios'
import type * as userTypes from '@/ts/types/user'

export default (fetch: AxiosInstance) => ({
  all() {
    return fetch<userTypes.User[]>('https://jsonplaceholder.typicode.com/users')
  },
})
