import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'

import { WelfareReportModel } from '@/domain/models/welfare_report_model'
import { WelfareReportRepository } from '@/domain/repositories/welfare_report_repository'

export class WelfareReportRepositorySoori implements WelfareReportRepository {
  async getWelfareReport(userId: string): Promise<WelfareReportModel | null> {
    try {
      console.log('📊 Fetching welfare report for user:', userId)
      const db = getFirestore()
      const docRef = doc(collection(db, 'user_welfare_reports'), userId)
      console.log('📍 Document path:', docRef.path)

      const docSnap = await getDoc(docRef)
      console.log('📄 Document exists:', docSnap.exists())

      if (!docSnap.exists()) {
        console.log('❌ No welfare report found for user:', userId)
        console.log('💡 Try generating a report using the "리포트 생성하기" button')
        return null
      }

      const data = docSnap.data() as {
        userId?: string
        summary?: string
        risk?: string
        services?: { name: string; reason: string; link?: string }[]
        metadata?: {
          weeklyKm?: number
          trend?: string
          recentRepairs?: number
          recentSelfChecks?: number
          supportedDistrict?: string
        }
        isFallback?: boolean
        createdAt?: { toDate?: () => Date }
      }

      console.log('✅ Report data retrieved:', {
        userId: data.userId,
        hasServices: !!data.services,
        servicesCount: data.services?.length,
        hasSummary: !!data.summary,
        hasRisk: !!data.risk,
        createdAt: data.createdAt,
      })

      return new WelfareReportModel({
        userId: data.userId,
        summary: data.summary,
        risk: data.risk,
        services: data.services,
        metadata: data.metadata,
        isFallback: data.isFallback,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      })
    } catch (error) {
      console.error('❌ 복지 리포트 조회 실패:', error)
      throw error
    }
  }
}
