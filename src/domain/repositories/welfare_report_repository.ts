import { WelfareReportModel } from '@/domain/models/welfare_report_model'

export interface WelfareReportRepository {
  getWelfareReport(token: string): Promise<WelfareReportModel | null>
}
