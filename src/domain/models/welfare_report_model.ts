interface WelfareReport {
  userId?: string
  summary?: string
  risk?: string
  services?: {
    name: string
    reason: string
    link?: string
  }[]
  metadata?: {
    weeklyKm?: number
    trend?: string
    recentRepairs?: number
    recentSelfChecks?: number
    supportedDistrict?: string
  }
  isFallback?: boolean
  createdAt?: Date
}

export class WelfareReportModel implements WelfareReport {
  readonly userId: string
  readonly summary: string
  readonly risk: string
  readonly services: { name: string; reason: string; link?: string }[]
  readonly metadata: {
    weeklyKm: number
    trend: string
    recentRepairs: number
    recentSelfChecks: number
    supportedDistrict: string
  }
  readonly isFallback: boolean
  readonly createdAt: Date

  constructor(model: WelfareReport) {
    this.userId = model.userId ?? ''
    this.summary = model.summary ?? ''
    this.risk = model.risk ?? ''
    this.services = model.services ?? []
    this.metadata = {
      weeklyKm: model.metadata?.weeklyKm ?? 0,
      trend: model.metadata?.trend ?? 'stable',
      recentRepairs: model.metadata?.recentRepairs ?? 0,
      recentSelfChecks: model.metadata?.recentSelfChecks ?? 0,
      supportedDistrict: model.metadata?.supportedDistrict ?? '성동구',
    }
    this.isFallback = model.isFallback ?? false
    this.createdAt = new Date(model.createdAt ?? new Date())
  }

  get createdAtDisplayString(): string {
    return this.createdAt.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  get trendDisplayString(): string {
    const trendMap: Record<string, string> = {
      increase: '증가 추세 📈',
      decrease: '감소 추세 📉',
      stable: '안정 유지 ➡️',
    }
    return trendMap[this.metadata.trend] ?? '데이터 없음'
  }

  get trendDescription(): string {
    const descMap: Record<string, string> = {
      increase: '최근 이동량이 증가하고 있습니다',
      decrease: '최근 이동량이 감소하고 있습니다',
      stable: '최근 7일간 이동량이 일정합니다',
    }
    return descMap[this.metadata.trend] ?? '이동 데이터가 충분하지 않습니다'
  }
}
