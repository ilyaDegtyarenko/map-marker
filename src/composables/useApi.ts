import api from '@/plugins/api.ts'
import AuthService from '@/services/auth.service.ts'
import UserService from '@/services/user.service.ts'

export const useApi = () => {
  return {
    auth: AuthService(api),
    user: UserService(api),
  }
}
