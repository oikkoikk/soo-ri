import { useState, useEffect, useRef, useCallback } from 'react'

import { useNavigate } from 'react-router'

import { useAuthState } from '@/presentation/hooks/hooks'
import { useWelfareReport } from '@/presentation/hooks/useWelfareReport'

// V2 비동기 상태 타입
type AsyncStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'failed'

interface TaskStatus {
  taskId: string
  userId: string
  status: AsyncStatus
  createdAt?: string
  completedAt?: string
  error?: string
}

export function useWelfareReportViewModel() {
  const navigate = useNavigate()
  const { user } = useAuthState()
  const { report, isLoading, refetch } = useWelfareReport()
  const [generating, setGenerating] = useState(false)

  // V2 비동기 상태
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>('idle')
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goBack = () => {
    void navigate(-1)
  }

  // API URL 헬퍼
  const getApiUrl = useCallback((): string => {
    const envUrl = import.meta.env.VITE_SOORI_BASE_URL as string | undefined
    if (envUrl?.includes('cloudfunctions.net')) {
      return envUrl
    }
    return 'https://asia-northeast3-soo-ri.cloudfunctions.net/api'
  }, [])

  // 상태 폴링 함수
  const pollTaskStatus = useCallback(
    async (taskId: string) => {
      const API_URL = getApiUrl()

      try {
        const response = await fetch(`${API_URL}/admin/welfare/status/${taskId}`)
        if (!response.ok) {
          throw new Error('상태 조회 실패')
        }

        const status = (await response.json()) as TaskStatus
        console.log('📊 Task status:', status)

        setAsyncStatus(status.status)

        switch (status.status) {
          case 'queued':
            setStatusMessage('대기 중... AI가 곧 분석을 시작합니다')
            break
          case 'processing':
            setStatusMessage('AI가 분석 중입니다...')
            break
          case 'completed':
            setStatusMessage('완료!')
            // 폴링 중지
            if (pollingRef.current) {
              clearInterval(pollingRef.current)
              pollingRef.current = null
            }
            // 리포트 새로고침
            await refetch()
            setGenerating(false)
            setCurrentTaskId(null)
            break
          case 'failed':
            setStatusMessage(`실패: ${status.error ?? '알 수 없는 오류'}`)
            if (pollingRef.current) {
              clearInterval(pollingRef.current)
              pollingRef.current = null
            }
            setGenerating(false)
            setCurrentTaskId(null)
            break
        }
      } catch (error) {
        console.error('❌ 상태 조회 오류:', error)
      }
    },
    [getApiUrl, refetch]
  )

  // 폴링 시작
  const startPolling = useCallback(
    (taskId: string) => {
      // 기존 폴링 중지
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }

      // 즉시 한 번 조회
      void pollTaskStatus(taskId)

      // 2초마다 폴링
      pollingRef.current = setInterval(() => {
        void pollTaskStatus(taskId)
      }, 2000)
    },
    [pollTaskStatus]
  )

  // 컴포넌트 언마운트 시 폴링 정리
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])

  // V2 비동기 리포트 생성
  const generateReportAsync = async () => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    const API_URL = getApiUrl()
    console.log('🚀 [V2] Async report generation for user:', user.uid)

    setGenerating(true)
    setAsyncStatus('idle')
    setStatusMessage('요청 전송 중...')

    try {
      const response = await fetch(`${API_URL}/admin/welfare/generate/async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      })

      console.log('📡 Response status:', response.status)

      // 429: 중복 요청
      if (response.status === 429) {
        const result = (await response.json()) as { taskId?: string; message?: string }
        setStatusMessage('이미 생성 중인 리포트가 있습니다')
        if (result.taskId) {
          setCurrentTaskId(result.taskId)
          startPolling(result.taskId)
        }
        return
      }

      // 202: 요청 접수됨
      if (response.status === 202) {
        const result = (await response.json()) as { taskId: string; status: string; estimatedTime?: string }
        console.log('✅ Task created:', result)

        setCurrentTaskId(result.taskId)
        setAsyncStatus('queued')
        setStatusMessage(`요청 접수됨 (예상 시간: ${result.estimatedTime ?? '30초~1분'})`)

        // 폴링 시작
        startPolling(result.taskId)
        return
      }

      // 기타 에러
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`요청 실패: ${String(response.status)} - ${errorText}`)
      }
    } catch (error) {
      console.error('❌ 리포트 생성 오류:', error)
      const message = error instanceof Error ? error.message : '알 수 없는 오류'
      setStatusMessage(`오류: ${message}`)
      setAsyncStatus('failed')
      setGenerating(false)
    }
  }

  // V1 동기식 리포트 생성 (폴백용)
  const generateTestReport = async () => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    console.log('🔑 [V1] Sync report generation for user:', user.uid)

    setGenerating(true)
    try {
      const API_URL = getApiUrl()
      console.log('🌐 API URL:', API_URL)

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
    // V1 (폴백)
    generateTestReport,
    // V2 (비동기)
    generateReportAsync,
    asyncStatus,
    statusMessage,
    currentTaskId,
  }
}
