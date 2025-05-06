import type { AxiosInstance } from 'axios'
import type * as userTypes from '@/ts/types/user'
import { modifyUserAddresses } from '@/utils/modifyUserAddresses.ts'

export default (fetch: AxiosInstance) => ({
  all() {
    return fetch<userTypes.User[]>('https://jsonplaceholder.typicode.com/users',{
      transformResponse: (data) => {
        return JSON.parse(data).map(modifyUserAddresses)
      }
    })
  },
})
