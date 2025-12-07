import { useState } from 'react'

import { useNavigate } from 'react-router'

import { useAuthState } from '@/presentation/hooks/hooks'
import { useWelfareReport } from '@/presentation/hooks/useWelfareReport'

export function useWelfareReportViewModel() {
  const navigate = useNavigate()
  const { user } = useAuthState()
  const { report, isLoading, refetch } = useWelfareReport()
  const [generating, setGenerating] = useState(false)

  const goBack = () => {
    void navigate(-1)
  }

  const generateTestReport = async () => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    console.log('🔑 Current User ID:', user.uid)

    setGenerating(true)
    try {
      const getApiUrl = (envUrl: string | undefined): string => {
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        if (envUrl && envUrl.includes('cloudfunctions.net')) {
          return envUrl
        }
        return 'https://asia-northeast3-soo-ri.cloudfunctions.net/api'
      }
      const API_URL = getApiUrl(import.meta.env.VITE_SOORI_BASE_URL as string | undefined)
      console.log('🌐 API URL:', API_URL)
      console.log('📝 Generating report for user:', user.uid)

      const response = await fetch(`${API_URL}/admin/welfare/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      })

      console.log('📡 Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        throw new Error(`리포트 생성 실패: ${String(response.status)}`)
      }

      const result = (await response.json()) as unknown
      console.log('✅ Report generated:', result)

      // Wait a bit for Firestore to update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Refetch to show new report
      const { data } = await refetch()
      console.log('📊 Refetched report:', data)

      if (data) {
        alert('리포트가 생성되었습니다!')
      } else {
        alert('리포트가 생성되었지만 불러오는데 실패했습니다. 페이지를 새로고침해주세요.')
      }
    } catch (error) {
      console.error('❌ 리포트 생성 오류:', error)
      const message = error instanceof Error ? error.message : '알 수 없는 오류'
      alert(`리포트 생성에 실패했습니다: ${message}`)
    } finally {
      setGenerating(false)
    }
  }

  return {
    report,
    isLoading,
    generating,
    goBack,
    refetch,
    generateTestReport,
  }
}
