import { useState } from 'react'

import { selfCheckRepositorySoori } from '@/data/services/services'
import { SelfCheckModel } from '@/domain/models/models'

import { useAuthState } from './useAuthState'

interface UseSelfCheckParams {
  vehicleId: string
}

export const useSelfCheck = ({ vehicleId }: UseSelfCheckParams) => {
  const { user } = useAuthState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

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

  return {
    createSelfCheck,
    loading,
    error,
  }
}
