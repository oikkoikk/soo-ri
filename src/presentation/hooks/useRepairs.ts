import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { repairRepositorySoori } from '@/data/services/services'
import { RepairModel } from '@/domain/models/models'

import { useAuthState } from './useAuthState'
import { useLoading } from './useLoading'

export const useRepairs = ({ vehicleId }: { vehicleId: string }) => {
  const { user, loading: authLoading } = useAuthState()
  const { showLoading, hideLoading } = useLoading()

  const query = useQuery<RepairModel[]>({
    queryKey: ['repairs', vehicleId],
    queryFn: async () => {
      if (!user) throw new Error('로그인 후 이용 가능합니다')

      const token = await user.getIdToken()
      return await repairRepositorySoori.getRepairsByVehicleId(token, vehicleId)
    },
    enabled: !!vehicleId && !authLoading,
  })

  useEffect(() => {
    if (query.isLoading) showLoading()
    else hideLoading()
  }, [query.isLoading, showLoading, hideLoading])

  useEffect(() => {
    if (query.error) throw query.error
  }, [query.error])

  return {
    repairs: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
