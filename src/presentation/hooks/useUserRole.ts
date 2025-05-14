import { useQuery } from '@tanstack/react-query'

import { userRepositorySoori } from '@/data/services/services'

import { useAuthState } from './useAuthState'

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuthState()

  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ['role', user?.uid],
    queryFn: async () => {
      if (!user) {
        return null
      }

      const token = await user.getIdToken()
      return userRepositorySoori.getUserRole(token)
    },
    enabled: !!user,
  })

  const isLoading = authLoading || roleLoading
  const isAdmin = userRole === 'admin'
  const isRepairer = userRole === 'repairer'
  const isUser = userRole === 'user'
  const isGuardian = userRole === 'guardian'

  return {
    userRole,
    isLoading,
    isAdmin,
    isRepairer,
    isUser,
    isGuardian,
  }
}
