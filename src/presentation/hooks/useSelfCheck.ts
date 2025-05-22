import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { selfCheckRepositorySoori } from '@/data/services/services'
import { SelfCheckModel } from '@/domain/models/models'

import { useAuthState } from './useAuthState'
import { useLoading } from './useLoading'

interface UseSelfCheckParams {
  vehicleId: string
}

export const useSelfCheck = ({ vehicleId }: UseSelfCheckParams) => {
  const { user, loading: authLoading } = useAuthState()
  const { showLoading, hideLoading } = useLoading()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const query = useQuery<SelfCheckModel[]>({
    queryKey: ['selfChecks', vehicleId],
    queryFn: async () => {
      if (!user) throw new Error('로그인 후 이용 가능합니다')

      const token = await user.getIdToken()
      return await selfCheckRepositorySoori.getSelfChecks(vehicleId, token)
    },
    enabled: !!vehicleId && !authLoading,
  })

  useEffect(() => {
    if (query.isLoading) showLoading()
    else hideLoading()
  }, [query.isLoading, showLoading, hideLoading])

  const createSelfCheck = async (selfCheckData: SelfCheckModel): Promise<SelfCheckModel | null> => {
    if (!user || !vehicleId) return null

    try {
      setLoading(true)
      setError(null)

      const token = await user.getIdToken()
      const result = await selfCheckRepositorySoori.createSelfCheck(vehicleId, selfCheckData, token)
      return result
    } catch (e) {
      const err = e instanceof Error ? e : new Error('자가점검 데이터 저장 중 오류가 발생했습니다.')
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query.error) throw query.error
  }, [query.error])

  const refreshSelfChecks = () => {
    void query.refetch()
  }

  return {
    createSelfCheck,
    loading,
    error,
    selfChecks: query.data ?? [],
    isSelfChecksLoading: query.isLoading,
    isSelfChecksError: query.isError,
    selfChecksError: query.error,
    refreshSelfChecks,
  }
}
