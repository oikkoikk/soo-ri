/**
 * Dual-Axis Report System
 *
 * V1 문제점: 사용자 활동성과 기기 건강도를 단일 점수로 합산
 * - 높은 주행거리: 사용자에게 좋음 (활동적) but 기기에게 나쁨 (마모)
 *
 * V2 해결: 두 축을 분리하여 평가
 * 1. User Mobility Index (사람의 활동성)
 * 2. Device Condition Index (기기의 건강도)
 */

// ============================================
// 1. 상태 타입 정의
// ============================================

/** 사용자 활동 상태 */
export type MobilityStatus = 'active' | 'stable' | 'declining' | 'inactive'

/** 기기 상태 등급 */
export type DeviceGrade = 'A' | 'B' | 'C'

/** 추세 방향 */
export type TrendDirection = 'increase' | 'stable' | 'decrease'

// ============================================
// 2. 사용자 활동성 인덱스
// ============================================

export interface UserMobilityIndex {
  /** 상태: active(활발), stable(안정), declining(감소), inactive(비활동) */
  status: MobilityStatus

  /** 상태 색상: green, blue, yellow, red */
  statusColor: 'green' | 'blue' | 'yellow' | 'red'

  /** 상태 아이콘 */
  statusIcon: string

  /** 상태 라벨 (한글) */
  statusLabel: string

  /** 주간 이동거리 (km) */
  weeklyKm: number

  /** 지난주 대비 변화량 (km) */
  weeklyKmDelta: number

  /** 추세 방향 */
  trend: TrendDirection

  /** 활동 일수 (최근 7일 중) */
  activeDays: number

  /** 근거 설명 */
  evidence: string
}

// ============================================
// 3. 기기 상태 인덱스
// ============================================

export interface DeviceConditionIndex {
  /** 등급: A(양호), B(점검권장), C(주의필요) */
  grade: DeviceGrade

  /** 등급 색상 */
  gradeColor: 'green' | 'yellow' | 'red'

  /** 등급 아이콘 */
  gradeIcon: string

  /** 등급 라벨 (한글) */
  gradeLabel: string

  /** 누적 주행거리 (km) - 추정치 */
  cumulativeKm: number

  /** 최근 수리 횟수 (30일) */
  recentRepairs: number

  /** 최근 자가점검 횟수 (30일) */
  recentSelfChecks: number

  /** 마지막 점검 이후 경과일 */
  daysSinceLastCheck: number

  /** 사용 강도 (low, medium, high) */
  usageIntensity: 'low' | 'medium' | 'high'

  /** 근거 설명 */
  evidence: string

  /** 권장 조치 */
  recommendation: string
}

// ============================================
// 4. 분리된 서비스 추천
// ============================================

export interface ServiceRecommendation {
  name: string
  reason: string
  link?: string
  category: 'mobility' | 'device'
}

// ============================================
// 5. 분석 함수 타입
// ============================================

export interface UserStats {
  weeklyKm: number
  previousWeeklyKm?: number
  trend: TrendDirection
  activeDays?: number
}

export interface DeviceStats {
  recentRepairs: number
  recentSelfChecks: number
  daysSinceLastCheck?: number
  estimatedCumulativeKm?: number
}

// ============================================
// 6. 상태/등급 매핑 상수
// ============================================

export const MOBILITY_STATUS_CONFIG: Record<
  MobilityStatus,
  {
    color: 'green' | 'blue' | 'yellow' | 'red'
    icon: string
    label: string
  }
> = {
  active: { color: 'green', icon: '🟢', label: '활발' },
  stable: { color: 'blue', icon: '🔵', label: '안정' },
  declining: { color: 'yellow', icon: '🟡', label: '감소 중' },
  inactive: { color: 'red', icon: '🔴', label: '비활동' },
}

export const DEVICE_GRADE_CONFIG: Record<
  DeviceGrade,
  {
    color: 'green' | 'yellow' | 'red'
    icon: string
    label: string
  }
> = {
  A: { color: 'green', icon: '✅', label: '양호' },
  B: { color: 'yellow', icon: '⚠️', label: '점검 권장' },
  C: { color: 'red', icon: '🔧', label: '주의 필요' },
}
