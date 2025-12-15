/**
 * WelfareReportPageViewMobile V2
 *
 * Dual-Axis Report System 적용
 * - 사용자 활동성 (User Mobility Index)
 * - 기기 상태 (Device Condition Index)
 */

import { useMemo } from 'react'

import { css, useTheme, type Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { ScrollRestoration } from 'react-router'

import { convertLegacyToDualAxis } from '@/domain/logic/analyzeDualMetrics'
import type { ServiceRecommendation } from '@/domain/models/dual_axis_report_model'
import { Header } from '@/presentation/components/components'
import { ActivityIcon } from '@/presentation/components/icons/ActivityIcon'
import { CalendarIcon } from '@/presentation/components/icons/CalendarIcon'
import { ChartIcon } from '@/presentation/components/icons/ChartIcon'
import { CheckIcon } from '@/presentation/components/icons/CheckIcon'
import { HeartIcon } from '@/presentation/components/icons/HeartIcon'
import { LightbulbIcon } from '@/presentation/components/icons/LightbulbIcon'
import { MapPinIcon } from '@/presentation/components/icons/MapPinIcon'
import { MobilityAidIcon } from '@/presentation/components/icons/MobilityAidIcon'
import { RouteIcon } from '@/presentation/components/icons/RouteIcon'
import { SatelliteIcon } from '@/presentation/components/icons/SatelliteIcon'
import { SparklesIcon } from '@/presentation/components/icons/SparklesIcon'
import { TransitIcon } from '@/presentation/components/icons/TransitIcon'
import { WrenchIcon } from '@/presentation/components/icons/WrenchIcon'

import { useWelfareReportViewModel } from './WelfareReportPageViewModel'

export const WelfareReportPageViewMobileV2 = observer(() => {
  const theme = useTheme()
  const viewModel = useWelfareReportViewModel()

  // Dual-Axis 분석 결과 계산
  const dualAxisData = useMemo(() => {
    if (!viewModel.report?.metadata) return null
    return convertLegacyToDualAxis(viewModel.report.metadata)
  }, [viewModel.report?.metadata])

  // 서비스 분류 (백엔드 category 우선, 없으면 키워드 기반 폴백)
  const categorizedServices = useMemo(() => {
    if (!viewModel.report?.services) return { forMobility: [], forWelfare: [] }

    const forMobility: ServiceRecommendation[] = []
    const forWelfare: ServiceRecommendation[] = []

    viewModel.report.services.forEach((service) => {
      // 백엔드에서 category가 제공되면 사용
      const serviceWithCategory = service as { name: string; reason: string; link?: string; category?: string }

      if (serviceWithCategory.category === 'welfare') {
        forWelfare.push({ ...service, category: 'device' })
      } else {
        // mobility 또는 category 없으면 이동지원으로 분류
        forMobility.push({ ...service, category: 'mobility' })
      }
    })

    return { forMobility, forWelfare }
  }, [viewModel.report?.services])

  return (
    <Container>
      <ScrollRestoration />
      <StickyTop theme={theme}>
        <Header title="내 이동보조기기 리포트" onBack={viewModel.goBack} />
      </StickyTop>

      <MainContent>
        {viewModel.report && dualAxisData ? (
          <>
            {/* Section A: Dual Status Cards */}
            <DualStatusSection>
              {/* 사용자 활동성 카드 */}
              <StatusCard theme={theme} statusColor={dualAxisData.userMobility.statusColor}>
                <CardLabel theme={theme}>나의 활동</CardLabel>
                <StatusBadge color={dualAxisData.userMobility.statusColor}>
                  {dualAxisData.userMobility.statusLabel}
                </StatusBadge>
                <CardValue theme={theme}>
                  {dualAxisData.userMobility.weeklyKm > 0
                    ? `${dualAxisData.userMobility.weeklyKm.toFixed(0)}km 이동`
                    : '데이터 수집 중'}
                </CardValue>
                <CardSubtext theme={theme}>최근 7일</CardSubtext>
              </StatusCard>

              {/* 기기 상태 카드 */}
              <StatusCard theme={theme} statusColor={dualAxisData.deviceCondition.gradeColor}>
                <CardLabel theme={theme}>이동보조기기 상태</CardLabel>
                <StatusBadge color={dualAxisData.deviceCondition.gradeColor}>
                  {dualAxisData.deviceCondition.gradeLabel}
                </StatusBadge>
                <CardValue theme={theme}>등급 {dualAxisData.deviceCondition.grade}</CardValue>
                <CardSubtext theme={theme}>
                  {dualAxisData.deviceCondition.usageIntensity === 'high'
                    ? '사용량 높음'
                    : dualAxisData.deviceCondition.usageIntensity === 'medium'
                      ? '보통 사용'
                      : '사용량 적음'}
                </CardSubtext>
              </StatusCard>
            </DualStatusSection>

            {/* Section B: Contextual Evidence */}
            <EvidenceSection theme={theme}>
              <SectionTitleWithIcon>
                <ChartIcon size={20} color="#1A1A1A" />
                <SectionTitle theme={theme}>분석 근거</SectionTitle>
              </SectionTitleWithIcon>

              {/* 활동성 근거 */}
              <EvidenceCard theme={theme}>
                <EvidenceHeader>
                  <ActivityIcon size={18} color="#424242" />
                  <EvidenceLabel theme={theme}>활동 분석</EvidenceLabel>
                </EvidenceHeader>
                <EvidenceText theme={theme}>{dualAxisData.userMobility.evidence}</EvidenceText>
                {dualAxisData.userMobility.weeklyKmDelta !== 0 && (
                  <DeltaBadge positive={dualAxisData.userMobility.weeklyKmDelta > 0}>
                    {dualAxisData.userMobility.weeklyKmDelta > 0 ? '↑' : '↓'}
                    {Math.abs(dualAxisData.userMobility.weeklyKmDelta).toFixed(1)}km
                  </DeltaBadge>
                )}
              </EvidenceCard>

              {/* 기기 상태 근거 */}
              <EvidenceCard theme={theme}>
                <EvidenceHeader>
                  <MobilityAidIcon size={18} color="#424242" />
                  <EvidenceLabel theme={theme}>기기 상태</EvidenceLabel>
                </EvidenceHeader>
                <EvidenceText theme={theme}>{dualAxisData.deviceCondition.evidence}</EvidenceText>
                <RecommendationText theme={theme}>
                  <LightbulbIcon size={14} color="#1565C0" />
                  {dualAxisData.deviceCondition.recommendation}
                </RecommendationText>
              </EvidenceCard>

              {/* 등급 기준 설명 */}
              <GradeGuideCard theme={theme}>
                <GradeGuideTitle theme={theme}>등급 산정 기준 (최근 30일)</GradeGuideTitle>
                <GradeGuideList>
                  <GradeGuideItem theme={theme}>
                    <GradeBadge color="green">A</GradeBadge>
                    <span>자가점검 1회 이상 완료, 수리 이력 없음</span>
                  </GradeGuideItem>
                  <GradeGuideItem theme={theme}>
                    <GradeBadge color="yellow">B</GradeBadge>
                    <span>자가점검 기록 없음 또는 사용량 높음</span>
                  </GradeGuideItem>
                  <GradeGuideItem theme={theme}>
                    <GradeBadge color="red">C</GradeBadge>
                    <span>수리 이력 1회 이상 또는 장기간 미점검</span>
                  </GradeGuideItem>
                </GradeGuideList>
              </GradeGuideCard>

              {/* GPS 센서 안내 */}
              {viewModel.report.metadata.weeklyKm === 0 && (
                <SensorGuideCard theme={theme}>
                  <SatelliteIcon size={24} color="#1565C0" />
                  <SensorGuideContent>
                    <SensorGuideTitle theme={theme}>GPS 센서를 부착하면</SensorGuideTitle>
                    <SensorGuideText theme={theme}>
                      실시간 이동 패턴 분석, 더 정확한 복지 추천을 받을 수 있습니다.
                    </SensorGuideText>
                  </SensorGuideContent>
                </SensorGuideCard>
              )}

              {/* 상세 통계 */}
              <StatsGrid>
                <StatItem theme={theme}>
                  <RouteIcon size={20} color="#757575" />
                  <StatValue theme={theme}>{viewModel.report.metadata.weeklyKm.toFixed(0)}km</StatValue>
                  <StatLabel theme={theme}>주간 이동</StatLabel>
                </StatItem>
                <StatItem theme={theme}>
                  <WrenchIcon size={22} color="#757575" />
                  <StatValue theme={theme}>{viewModel.report.metadata.recentRepairs}회</StatValue>
                  <StatLabel theme={theme}>최근 수리</StatLabel>
                </StatItem>
                <StatItem theme={theme}>
                  <CheckIcon size={20} color="#757575" />
                  <StatValue theme={theme}>{viewModel.report.metadata.recentSelfChecks}회</StatValue>
                  <StatLabel theme={theme}>자가점검</StatLabel>
                </StatItem>
                <StatItem theme={theme}>
                  <MapPinIcon size={20} color="#757575" />
                  <StatValue theme={theme} style={{ fontSize: '14px' }}>
                    {viewModel.report.metadata.supportedDistrict}
                  </StatValue>
                  <StatLabel theme={theme}>지원 지역</StatLabel>
                </StatItem>
              </StatsGrid>
            </EvidenceSection>

            {/* Section C: Decoupled Recommendations */}
            {categorizedServices.forMobility.length > 0 && (
              <RecommendationSection theme={theme}>
                <SectionHeader>
                  <IconWrapper bgColor="#2196F3">
                    <TransitIcon size={18} color="#2196F3" />
                  </IconWrapper>
                  <SectionTitle theme={theme}>이동지원 관련 복지서비스</SectionTitle>
                </SectionHeader>
                <ServiceList>
                  {categorizedServices.forMobility.map((service, index) => (
                    <ServiceItem
                      key={index}
                      theme={theme}
                      onClick={() => service.link && window.open(service.link, '_blank')}
                      clickable={!!service.link}
                    >
                      <ServiceNumber bgColor="#2196F3">{index + 1}</ServiceNumber>
                      <ServiceContent>
                        <ServiceName theme={theme}>{service.name}</ServiceName>
                        <ServiceReason theme={theme}>{service.reason}</ServiceReason>
                      </ServiceContent>
                      {service.link && <ServiceArrow>→</ServiceArrow>}
                    </ServiceItem>
                  ))}
                </ServiceList>
              </RecommendationSection>
            )}

            {categorizedServices.forWelfare.length > 0 && (
              <RecommendationSection theme={theme}>
                <SectionHeader>
                  <IconWrapper bgColor="#4CAF50">
                    <HeartIcon size={18} color="#4CAF50" />
                  </IconWrapper>
                  <SectionTitle theme={theme}>생활지원 관련 복지서비스</SectionTitle>
                </SectionHeader>
                <ServiceList>
                  {categorizedServices.forWelfare.map((service, index) => (
                    <ServiceItem
                      key={index}
                      theme={theme}
                      onClick={() => service.link && window.open(service.link, '_blank')}
                      clickable={!!service.link}
                    >
                      <ServiceNumber bgColor="#4CAF50">{index + 1}</ServiceNumber>
                      <ServiceContent>
                        <ServiceName theme={theme}>{service.name}</ServiceName>
                        <ServiceReason theme={theme}>{service.reason}</ServiceReason>
                      </ServiceContent>
                      {service.link && <ServiceArrow>→</ServiceArrow>}
                    </ServiceItem>
                  ))}
                </ServiceList>
              </RecommendationSection>
            )}

            {/* 분류되지 않은 서비스 (둘 다 비어있을 경우) */}
            {categorizedServices.forWelfare.length === 0 && categorizedServices.forMobility.length === 0 && (
              <RecommendationSection theme={theme}>
                <SectionHeader>
                  <IconWrapper bgColor="#2196F3">
                    <TransitIcon size={18} color="#2196F3" />
                  </IconWrapper>
                  <SectionTitle theme={theme}>이동지원 관련 복지서비스</SectionTitle>
                </SectionHeader>
                <ServiceList>
                  {viewModel.report.services.map((service, index) => (
                    <ServiceItem
                      key={index}
                      theme={theme}
                      onClick={() => service.link && window.open(service.link, '_blank')}
                      clickable={!!service.link}
                    >
                      <ServiceNumber bgColor="#667eea">{index + 1}</ServiceNumber>
                      <ServiceContent>
                        <ServiceName theme={theme}>{service.name}</ServiceName>
                        <ServiceReason theme={theme}>{service.reason}</ServiceReason>
                      </ServiceContent>
                      {service.link && <ServiceArrow>→</ServiceArrow>}
                    </ServiceItem>
                  ))}
                </ServiceList>
              </RecommendationSection>
            )}

            {/* AI 요약 */}
            {viewModel.report.summary && (
              <AISummaryCard theme={theme}>
                <AISummaryHeader>
                  <SparklesIcon size={20} color="#667eea" />
                  <AILabel>AI 분석 요약</AILabel>
                </AISummaryHeader>
                <AISummaryText theme={theme}>
                  {viewModel.report.summary
                    .replace(/'stable'/g, "'안정'")
                    .replace(/'increase'/g, "'증가'")
                    .replace(/'decrease'/g, "'감소'")
                    .replace(/stable/g, '안정')
                    .replace(/increase/g, '증가')
                    .replace(/decrease/g, '감소')}
                </AISummaryText>
                {viewModel.report.advice && (
                  <AdviceBox theme={theme}>
                    <LightbulbIcon size={16} color="#616161" />
                    <AdviceText theme={theme}>{viewModel.report.advice}</AdviceText>
                  </AdviceBox>
                )}
              </AISummaryCard>
            )}

            {/* 푸터 */}
            <Footer theme={theme}>
              <FooterRow>
                <CalendarIcon size={14} color="#9E9E9E" />
                <FooterText theme={theme}>{viewModel.report.createdAtDisplayString} 생성</FooterText>
              </FooterRow>
            </Footer>
          </>
        ) : (
          /* Empty State */
          <EmptyState theme={theme}>
            <EmptyIconWrapper>
              <ChartIcon size={64} color="#BDBDBD" />
            </EmptyIconWrapper>
            <EmptyTitle theme={theme}>아직 생성된 리포트가 없습니다</EmptyTitle>
            <EmptySubtext theme={theme}>
              AI가 당신의 이동 패턴을 분석하고
              <br />
              맞춤형 복지 서비스를 추천해드립니다
            </EmptySubtext>

            {/* V2 비동기 상태 표시 */}
            {viewModel.generating && viewModel.statusMessage && (
              <AsyncStatusCard theme={theme}>
                {viewModel.asyncStatus === 'processing' && <SparklesIcon size={24} color="#667eea" />}
                <AsyncStatusText theme={theme}>{viewModel.statusMessage}</AsyncStatusText>
                {(viewModel.asyncStatus === 'queued' || viewModel.asyncStatus === 'processing') && <AsyncSpinner />}
              </AsyncStatusCard>
            )}

            <GenerateButton theme={theme} onClick={viewModel.generateReportAsync} disabled={viewModel.generating}>
              <SparklesIcon size={18} color="white" />
              {viewModel.generating ? '분석 중...' : 'AI 리포트 생성하기'}
            </GenerateButton>
          </EmptyState>
        )}
      </MainContent>
    </Container>
  )
})

// ============================================
// Styled Components
// ============================================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
`

const StickyTop = styled.div<{ theme: Theme }>`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.outline};
`

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 40px;
`

// Section A: Dual Status Cards
const DualStatusSection = styled.div`
  display: flex;
  gap: 12px;
`

const COLOR_MAP = {
  green: { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32' },
  blue: { bg: '#E3F2FD', border: '#90CAF9', text: '#1565C0' },
  yellow: { bg: '#FFF8E1', border: '#FFD54F', text: '#F57F17' },
  red: { bg: '#FFEBEE', border: '#EF9A9A', text: '#C62828' },
}

const StatusCard = styled.div<{ theme: Theme; statusColor: 'green' | 'blue' | 'yellow' | 'red' }>`
  flex: 1;
  background: ${({ statusColor }) => COLOR_MAP[statusColor].bg};
  border: 2px solid ${({ statusColor }) => COLOR_MAP[statusColor].border};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CardLabel = styled.span<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
  color: #757575;
  font-weight: 600;
`

const StatusBadge = styled.span<{ color: 'green' | 'blue' | 'yellow' | 'red' }>`
  align-self: flex-start;
  background: ${({ color }) =>
    color === 'green' ? '#4CAF50' : color === 'blue' ? '#2196F3' : color === 'yellow' ? '#FFC107' : '#F44336'};
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
`

const CardValue = styled.span<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  color: #1A1A1A;
  font-weight: 700;
`

const CardSubtext = styled.span<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #757575;
`

// Section B: Evidence
const EvidenceSection = styled.div<{ theme: Theme }>`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`

const SectionTitleWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const SectionTitle = styled.h3<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  color: #1A1A1A;
  margin: 0;
  font-weight: 700;
`

const EvidenceCard = styled.div<{ theme: Theme }>`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const EvidenceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const EvidenceLabel = styled.span<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.labelMedium};
  `}
  color: #424242;
  font-weight: 600;
`

const EvidenceText = styled.p<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #616161;
  margin: 0;
  line-height: 1.5;
`

const DeltaBadge = styled.span<{ positive: boolean }>`
  align-self: flex-start;
  background: ${({ positive }) => (positive ? '#E8F5E9' : '#FFEBEE')};
  color: ${({ positive }) => (positive ? '#2E7D32' : '#C62828')};
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
`

const RecommendationText = styled.p<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #1565C0;
  margin: 0;
  padding: 8px 12px;
  background: #e3f2fd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`

const StatItem = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: #f5f5f5;
  border-radius: 12px;
`

const StatValue = styled.span<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #1A1A1A;
  font-weight: 700;
`

const StatLabel = styled.span<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
  color: #9E9E9E;
  font-size: 10px;
`

// Section C: Recommendations
const RecommendationSection = styled.div<{ theme: Theme }>`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const IconWrapper = styled.div<{ bgColor: string }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bgColor }) => bgColor}20;
  border-radius: 8px;
`

// Grade Guide Card (피드백 #1: 등급 기준 설명)
const GradeGuideCard = styled.div<{ theme: Theme }>`
  background: #fafafa;
  border-radius: 12px;
  padding: 14px;
  border: 1px solid #e0e0e0;
`

const GradeGuideTitle = styled.h5<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.labelMedium};
  `}
  color: #616161;
  margin: 0 0 10px 0;
  font-weight: 600;
`

const GradeGuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const GradeGuideItem = styled.div<{ theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 10px;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #757575;
`

const GradeBadge = styled.span<{ color: 'green' | 'yellow' | 'red' }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => (color === 'green' ? '#4CAF50' : color === 'yellow' ? '#FFC107' : '#F44336')};
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
`

// Sensor Guide Card (피드백 #5: GPS 센서 안내)
const SensorGuideCard = styled.div<{ theme: Theme }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 12px;
  border: 1px solid #90caf9;
`

const SensorGuideContent = styled.div`
  flex: 1;
`

const SensorGuideTitle = styled.h5<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #1565C0;
  margin: 0 0 4px 0;
  font-weight: 600;
`

const SensorGuideText = styled.p<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #1976D2;
  margin: 0;
  line-height: 1.4;
`

const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ServiceItem = styled.div<{ theme: Theme; clickable: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  transition: background 0.2s;

  &:hover {
    background: ${({ clickable }) => (clickable ? '#F0F0F0' : '#F8F9FA')};
  }
`

const ServiceNumber = styled.span<{ bgColor: string }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bgColor }) => bgColor};
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
`

const ServiceContent = styled.div`
  flex: 1;
  min-width: 0;
`

const ServiceName = styled.h5<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #1A1A1A;
  margin: 0 0 4px 0;
  font-weight: 600;
`

const ServiceReason = styled.p<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #757575;
  margin: 0;
  line-height: 1.4;
`

const ServiceArrow = styled.span`
  color: #2196f3;
  font-size: 18px;
`

// AI Summary
const AISummaryCard = styled.div<{ theme: Theme }>`
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border: 1px solid #667eea30;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const AISummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const AILabel = styled.span`
  color: #667eea;
  font-weight: 700;
  font-size: 14px;
`

const AISummaryText = styled.p<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #424242;
  margin: 0;
  line-height: 1.6;
`

const AdviceBox = styled.div<{ theme: Theme }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 12px;
`

const AdviceText = styled.p<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #616161;
  margin: 0;
  line-height: 1.5;
`

// Footer
const Footer = styled.div<{ theme: Theme }>`
  text-align: center;
  padding: 16px;
`

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`

const FooterText = styled.span<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #9E9E9E;
`

// Empty State
const EmptyState = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
`

const EmptyIconWrapper = styled.div`
  margin-bottom: 8px;
`

const EmptyTitle = styled.p<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.subtitleLarge};
  `}
  color: #1A1A1A;
  margin: 0;
  font-weight: 700;
`

const EmptySubtext = styled.p<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #757575;
  margin: 0;
  text-align: center;
  line-height: 1.6;
`

const AsyncStatusCard = styled.div<{ theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  margin-top: 8px;
  width: 100%;
  max-width: 300px;
`

const AsyncStatusText = styled.span<{ theme: Theme }>`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #424242;
  flex: 1;
`

const AsyncSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const GenerateButton = styled.button<{ theme: Theme }>`
  margin-top: 16px;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  ${({ theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
