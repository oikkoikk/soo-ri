/**
 * Dual-Axis 분석 로직
 *
 * 사용자 활동성과 기기 건강도를 분리하여 평가
 */

import {
  type UserStats,
  type DeviceStats,
  type UserMobilityIndex,
  type DeviceConditionIndex,
  type MobilityStatus,
  type DeviceGrade,
  MOBILITY_STATUS_CONFIG,
  DEVICE_GRADE_CONFIG,
} from '../models/dual_axis_report_model'

// ============================================
// 1. 사용자 활동성 분석
// ============================================

function analyzeUserMobility(stats: UserStats): UserMobilityIndex {
  const { weeklyKm, previousWeeklyKm = 0, trend, activeDays = 0 } = stats

  // 상태 결정 로직
  let status: MobilityStatus

  if (weeklyKm >= 30) {
    // 30km 이상: 활발
    status = 'active'
  } else if (weeklyKm >= 10) {
    // 10-30km: 안정
    status = 'stable'
  } else if (weeklyKm >= 3) {
    // 3-10km: 감소 중 (주의)
    status = trend === ('decrease' as const) ? 'declining' : 'stable'
  } else {
    // 3km 미만: 비활동
    status = 'inactive'
  }

  // 추세에 따른 상태 조정
  if (trend === 'increase' && status !== 'active') {
    // 증가 추세면 한 단계 상향
    if (status === 'inactive') status = 'declining'
    else if (status === 'declining') status = 'stable'
    else status = 'active'
  }

  const config = MOBILITY_STATUS_CONFIG[status]
  const weeklyKmDelta = weeklyKm - previousWeeklyKm

  // 근거 설명 생성
  let evidence: string
  if (weeklyKm === 0) {
    evidence = '이번 주 이동 기록이 없습니다. GPS 센서 연결을 확인해주세요.'
  } else if (weeklyKmDelta > 0) {
    evidence = `이번 주 ${String(weeklyKm.toFixed(1))}km 이동 (지난주 대비 +${String(weeklyKmDelta.toFixed(1))}km)`
  } else if (weeklyKmDelta < 0) {
    evidence = `이번 주 ${String(weeklyKm.toFixed(1))}km 이동 (지난주 대비 ${String(weeklyKmDelta.toFixed(1))}km)`
  } else {
    evidence = `이번 주 ${weeklyKm.toFixed(1)}km 이동 (지난주와 동일)`
  }

  return {
    status,
    statusColor: config.color,
    statusIcon: config.icon,
    statusLabel: config.label,
    weeklyKm,
    weeklyKmDelta,
    trend,
    activeDays,
    evidence,
  }
}

// ============================================
// 2. 기기 상태 분석
// ============================================

function analyzeDeviceCondition(deviceStats: DeviceStats, userStats: UserStats): DeviceConditionIndex {
  const { recentRepairs, recentSelfChecks, daysSinceLastCheck = 30, estimatedCumulativeKm = 0 } = deviceStats

  const { weeklyKm } = userStats

  // 사용 강도 결정
  let usageIntensity: 'low' | 'medium' | 'high'
  if (weeklyKm >= 50) {
    usageIntensity = 'high'
  } else if (weeklyKm >= 20) {
    usageIntensity = 'medium'
  } else {
    usageIntensity = 'low'
  }

  // 등급 결정 로직
  let grade: DeviceGrade
  let recommendation: string

  // 점수 기반 등급 산정 (낮을수록 좋음)
  let riskScore = 0

  // 최근 수리 횟수 (수리가 많으면 위험)
  riskScore += recentRepairs * 20

  // 자가점검 부족 (점검 안 하면 위험)
  if (recentSelfChecks === 0) {
    riskScore += 15
  }

  // 마지막 점검 이후 경과일
  if (daysSinceLastCheck > 60) {
    riskScore += 20
  } else if (daysSinceLastCheck > 30) {
    riskScore += 10
  }

  // 높은 사용량 + 점검 부족 = 위험
  if (usageIntensity === 'high' && recentSelfChecks === 0) {
    riskScore += 15
  }

  // 등급 결정
  if (riskScore <= 10) {
    grade = 'A'
    recommendation = '현재 상태가 양호합니다. 정기 점검을 유지해주세요.'
  } else if (riskScore <= 30) {
    grade = 'B'
    recommendation =
      usageIntensity === 'high'
        ? '사용량이 많습니다. 배터리와 타이어 상태를 점검해주세요.'
        : '정기 자가점검을 권장합니다.'
  } else {
    grade = 'C'
    recommendation =
      recentRepairs > 0
        ? '최근 수리 이력이 있습니다. 전문 점검을 받아보세요.'
        : '오랜 기간 점검이 없었습니다. 안전을 위해 점검을 받아주세요.'
  }

  const config = DEVICE_GRADE_CONFIG[grade]

  // 근거 설명 생성
  const evidenceParts: string[] = []

  if (recentRepairs > 0) {
    evidenceParts.push(`최근 30일 수리 ${String(recentRepairs)}회`)
  }

  if (recentSelfChecks > 0) {
    evidenceParts.push(`자가점검 ${String(recentSelfChecks)}회 완료`)
  } else {
    evidenceParts.push('최근 자가점검 기록 없음')
  }

  if (usageIntensity === 'high') {
    evidenceParts.push('사용량 높음')
  }

  const evidence = evidenceParts.join(' · ')

  return {
    grade,
    gradeColor: config.color,
    gradeIcon: config.icon,
    gradeLabel: config.label,
    cumulativeKm: estimatedCumulativeKm,
    recentRepairs,
    recentSelfChecks,
    daysSinceLastCheck,
    usageIntensity,
    evidence,
    recommendation,
  }
}

// ============================================
// 3. 통합 분석 함수
// ============================================

export function analyzeDualMetrics(
  userStats: UserStats,
  deviceStats: DeviceStats
): {
  userMobility: UserMobilityIndex
  deviceCondition: DeviceConditionIndex
} {
  const userMobility = analyzeUserMobility(userStats)
  const deviceCondition = analyzeDeviceCondition(deviceStats, userStats)

  return {
    userMobility,
    deviceCondition,
  }
}

// ============================================
// 4. 기존 데이터 변환 헬퍼
// ============================================

/**
 * 기존 WelfareReportModel 데이터를 Dual-Axis 형식으로 변환
 */
export function convertLegacyToDualAxis(legacyMetadata: {
  weeklyKm: number
  trend: string
  recentRepairs: number
  recentSelfChecks: number
}): {
  userMobility: UserMobilityIndex
  deviceCondition: DeviceConditionIndex
} {
  const userStats: UserStats = {
    weeklyKm: legacyMetadata.weeklyKm,
    trend: legacyMetadata.trend as 'increase' | 'stable' | 'decrease',
  }

  const deviceStats: DeviceStats = {
    recentRepairs: legacyMetadata.recentRepairs,
    recentSelfChecks: legacyMetadata.recentSelfChecks,
  }

  return analyzeDualMetrics(userStats, deviceStats)
}
