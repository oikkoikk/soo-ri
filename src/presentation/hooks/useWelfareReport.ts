import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { welfareReportRepositorySoori } from '@/data/services/services'
import { WelfareReportModel } from '@/domain/models/welfare_report_model'

import { useAuthState } from './useAuthState'
import { useLoading } from './useLoading'

export function useWelfareReport() {
  const { user, loading: authLoading } = useAuthState()
  const { showLoading, hideLoading } = useLoading()

  const query = useQuery<WelfareReportModel | null>({
    queryKey: ['welfareReport', user?.uid],
    queryFn: async () => {
      if (!user) throw new Error('로그인 후 이용 가능합니다')
      return await welfareReportRepositorySoori.getWelfareReport(user.uid)
    },
    enabled: !authLoading && !!user,
  })

  useEffect(() => {
    if (query.isLoading) showLoading()
    else hideLoading()
  }, [query.isLoading, showLoading, hideLoading])

  useEffect(() => {
    if (query.error) throw query.error
  }, [query.error])

  return {
    report: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
