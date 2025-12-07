import { css, useTheme, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { ScrollRestoration } from 'react-router'

import { Header } from '@/presentation/components/components'

import { useWelfareReportViewModel } from './WelfareReportPageViewModel'

export const WelfareReportPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useWelfareReportViewModel()

  // 건강 점수 계산 (0-100)
  const calculateHealthScore = () => {
    if (!viewModel.report?.metadata) return 0
    const { weeklyKm, trend, recentRepairs, recentSelfChecks } = viewModel.report.metadata

    // 기본 점수 50점
    let score = 50

    // 주행거리 점수 (0-30점): 30-70km가 이상적
    if (weeklyKm >= 30 && weeklyKm <= 70) {
      score += 30
    } else if (weeklyKm > 70) {
      score += 20
    } else if (weeklyKm > 10) {
      score += 15
    }

    // 추세 점수 (0-20점)
    if (trend === 'stable') score += 20
    else if (trend === 'increase') score += 15
    else score += 10

    // 수리/점검 점수 감점
    score -= recentRepairs * 5
    score += Math.min(recentSelfChecks * 2, 10)

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  const healthScore = viewModel.report ? calculateHealthScore() : 0
  const scoreColor = healthScore >= 80 ? '#4CAF50' : healthScore >= 60 ? '#FFC107' : '#FF5252'

  return (
    <Container>
      <ScrollRestoration />
      <StickyTop theme={theme}>
        <Header title="내 휠체어 건강 리포트" onBack={viewModel.goBack} />
      </StickyTop>
      <MainContent>
        {viewModel.report ? (
          <>
            {/* AI 헤더 */}
            <AIHeader theme={theme}>
              <AIBadge theme={theme}>
                <AIIcon>🤖</AIIcon>
                <AIText>AI 종합 평가</AIText>
              </AIBadge>
              <HeaderSubtitle theme={theme}>인공지능이 분석한 맞춤형 복지 추천</HeaderSubtitle>
            </AIHeader>

            {/* 건강 점수 카드 */}
            <ScoreCard theme={theme}>
              <ScoreCircle color={scoreColor}>
                <ScoreNumber>{healthScore}</ScoreNumber>
                <ScoreLabel>점</ScoreLabel>
              </ScoreCircle>
              <ScoreTitle theme={theme}>휠체어 건강도</ScoreTitle>
              <ScoreDescription theme={theme}>
                {healthScore >= 80 ? '매우 좋음 👍' : healthScore >= 60 ? '양호 😊' : '주의 필요 ⚠️'}
              </ScoreDescription>

              {/* 점수 산정 근거 */}
              <ScoreBreakdown theme={theme}>
                <BreakdownTitle theme={theme}>📊 점수 산정 근거</BreakdownTitle>
                <BreakdownItem theme={theme}>
                  <BreakdownLabel>주행거리</BreakdownLabel>
                  <BreakdownValue>{Math.round(viewModel.report.metadata.weeklyKm)}km</BreakdownValue>
                </BreakdownItem>
                <BreakdownItem theme={theme}>
                  <BreakdownLabel>이동 추세</BreakdownLabel>
                  <BreakdownValue>{viewModel.report.trendDisplayString}</BreakdownValue>
                </BreakdownItem>
                <TrendDescription theme={theme}>{viewModel.report.trendDescription}</TrendDescription>
                <BreakdownItem theme={theme}>
                  <BreakdownLabel>최근 수리</BreakdownLabel>
                  <BreakdownValue>{viewModel.report.metadata.recentRepairs}회</BreakdownValue>
                </BreakdownItem>
                <BreakdownItem theme={theme}>
                  <BreakdownLabel>자가점검</BreakdownLabel>
                  <BreakdownValue>{viewModel.report.metadata.recentSelfChecks}회</BreakdownValue>
                </BreakdownItem>
              </ScoreBreakdown>
            </ScoreCard>

            {/* 주의 알림 (있을 경우) */}
            {viewModel.report.metadata.recentRepairs > 0 && (
              <AlertCard theme={theme}>
                <AlertIcon>⚠️</AlertIcon>
                <AlertContent>
                  <AlertTitle theme={theme}>점검 시기가 다가왔어요</AlertTitle>
                  <AlertText theme={theme}>
                    총 주행거리 {Math.round(viewModel.report.metadata.weeklyKm * 4)}km 도달
                  </AlertText>
                </AlertContent>
              </AlertCard>
            )}

            {/* 통계 카드들 */}
            <StatsGrid>
              <StatCard theme={theme}>
                <StatIcon>📍</StatIcon>
                <StatContent>
                  <StatLabel theme={theme}>총 주행거리</StatLabel>
                  <StatValue theme={theme}>{Math.round(viewModel.report.metadata.weeklyKm)}km</StatValue>
                  <StatSubtext theme={theme}>최근 7일</StatSubtext>
                </StatContent>
              </StatCard>

              <StatCard theme={theme}>
                <StatIcon>🔧</StatIcon>
                <StatContent>
                  <StatLabel theme={theme}>최근 수리</StatLabel>
                  <StatValue theme={theme}>{viewModel.report.metadata.recentRepairs}회</StatValue>
                  <StatSubtext theme={theme}>최근 30일</StatSubtext>
                </StatContent>
              </StatCard>

              <StatCard theme={theme}>
                <StatIcon>⏰</StatIcon>
                <StatContent>
                  <StatLabel theme={theme}>자가점검</StatLabel>
                  <StatValue theme={theme}>{viewModel.report.metadata.recentSelfChecks}회</StatValue>
                  <StatSubtext theme={theme}>최근 30일</StatSubtext>
                </StatContent>
              </StatCard>

              <StatCard theme={theme}>
                <StatIcon>📍</StatIcon>
                <StatContent>
                  <StatLabel theme={theme}>지원 지역</StatLabel>
                  <StatValue theme={theme} color="#2196F3">
                    {viewModel.report.metadata.supportedDistrict || '성동구'}
                  </StatValue>
                  <StatSubtext theme={theme}>담당 구역</StatSubtext>
                </StatContent>
              </StatCard>
            </StatsGrid>

            {/* AI 분석 섹션 */}
            <AnalysisSection>
              <SectionHeader theme={theme}>
                <SectionIcon>🤖</SectionIcon>
                <SectionTitle theme={theme}>AI 맞춤 복지 추천</SectionTitle>
              </SectionHeader>
              <AnalysisCard theme={theme}>
                <AnalysisText theme={theme}>{viewModel.report.summary}</AnalysisText>
              </AnalysisCard>
            </AnalysisSection>

            {/* 추천 서비스 */}
            <ServicesSection>
              <SectionHeader theme={theme}>
                <SectionIcon>🎯</SectionIcon>
                <SectionTitle theme={theme}>맞춤 복지 서비스</SectionTitle>
              </SectionHeader>
              {viewModel.report.services.map((service, index) => (
                <ModernServiceCard
                  key={index}
                  theme={theme}
                  onClick={() => {
                    if (service.link) {
                      window.open(service.link, '_blank')
                    }
                  }}
                  style={{ cursor: service.link ? 'pointer' : 'default' }}
                >
                  <ServiceNumber>{index + 1}</ServiceNumber>
                  <ServiceContent>
                    <ServiceName theme={theme}>{service.name}</ServiceName>
                    <ServiceReason theme={theme}>{service.reason}</ServiceReason>
                  </ServiceContent>
                  {service.link && <ServiceArrow>→</ServiceArrow>}
                </ModernServiceCard>
              ))}
            </ServicesSection>

            {/* 푸터 메타 */}
            <FooterMeta theme={theme}>
              <MetaItem>
                <MetaIcon>📅</MetaIcon>
                <MetaText theme={theme}>{viewModel.report.createdAtDisplayString}</MetaText>
              </MetaItem>
              <MetaDivider theme={theme}>·</MetaDivider>
              <MetaItem>
                <MetaIcon>📈</MetaIcon>
                <MetaText theme={theme}>추세: {viewModel.report.trendDisplayString}</MetaText>
              </MetaItem>
            </FooterMeta>
          </>
        ) : (
          <EmptyState theme={theme}>
            <EmptyIcon>📊</EmptyIcon>
            <EmptyText theme={theme}>아직 생성된 리포트가 없습니다</EmptyText>
            <EmptySubText theme={theme}>
              AI가 당신의 이동 패턴을 분석하고
              <br />
              맞춤형 복지 서비스를 추천해드립니다
            </EmptySubText>
            <GenerateButton theme={theme} onClick={viewModel.generateTestReport} disabled={viewModel.generating}>
              {viewModel.generating ? '✨ 분석 중...' : '✨ AI 리포트 생성하기'}
            </GenerateButton>
          </EmptyState>
        )}
      </MainContent>
    </Container>
  )
})

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
`

const StickyTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
`

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 40px;
`

// AI Header
const AIHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`

const AIBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
`

const AIIcon = styled.span`
  font-size: 14px;
`

const AIText = styled.span`
  color: white;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
`

const HeaderSubtitle = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: ${({ theme }: { theme: Theme }) => theme.colors.onSurfaceVariant};
  margin: 0;
  text-align: center;
`

// Score Card
const ScoreCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`

const ScoreCircle = styled.div<{ color: string }>`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: ${({ color }) => color};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px ${({ color }) => color}40;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${({ color }) => color}20, transparent);
    z-index: -1;
  }
`

const ScoreNumber = styled.div`
  font-size: 56px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.3);
`

const ScoreLabel = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: -4px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
`

const ScoreTitle = styled.h2`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.titleLarge};
  `}
  color: #1A1A1A;
  margin: 0;
  font-weight: 700;
`

const ScoreDescription = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyLarge};
  `}
  color: #424242;
  margin: 0;
  font-weight: 500;
`

// Score Breakdown
const ScoreBreakdown = styled.div`
  width: 100%;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`

const BreakdownTitle = styled.h3`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  color: #1A1A1A;
  margin: 0 0 12px 0;
  font-weight: 700;
`

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`

const BreakdownLabel = styled.span`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #616161;
`

const BreakdownValue = styled.span`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  color: #1A1A1A;
  font-weight: 700;
`

const TrendDescription = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #757575;
  margin: -4px 0 8px 0;
  font-style: italic;
  font-size: 12px;
`

// Alert Card
const AlertCard = styled.div`
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border: 1px solid #ffb74d;
`

const AlertIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
`

const AlertContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const AlertTitle = styled.h3`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  color: #E65100;
  margin: 0;
  font-weight: 700;
`

const AlertText = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #F57C00;
  margin: 0;
`

// Stats Grid
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
`

const StatIcon = styled.div`
  font-size: 28px;
  flex-shrink: 0;
`

const StatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StatLabel = styled.div`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.labelSmall};
  `}
  color: #757575;
  font-size: 11px;
`

const StatValue = styled.div<{ color?: string }>`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  color: ${({ color }: { color?: string; theme: Theme }) => color ?? '#1A1A1A'};
  font-weight: 700;
  font-size: 18px;
`

const StatSubtext = styled.div`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.labelSmall};
  `}
  color: #9E9E9E;
  font-size: 10px;
`

// Analysis Section
const AnalysisSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const SectionIcon = styled.span`
  font-size: 20px;
`

const SectionTitle = styled.h2`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.subtitleLarge};
  `}
  color: #1A1A1A;
  margin: 0;
  font-weight: 700;
`

const AnalysisCard = styled.div`
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #7986cb;
`

const AnalysisText = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #283593;
  margin: 0;
  line-height: 1.6;
  font-weight: 500;
`

// Services Section
const ServicesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ModernServiceCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }
`

const ServiceNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
`

const ServiceContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ServiceName = styled.h3`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  color: #1A1A1A;
  margin: 0;
  font-weight: 700;
`

const ServiceReason = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: #616161;
  margin: 0;
  line-height: 1.5;
`

const ServiceArrow = styled.div`
  font-size: 20px;
  color: #9e9e9e;
  flex-shrink: 0;
`

// Footer Meta
const FooterMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  margin-top: 8px;
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const MetaIcon = styled.span`
  font-size: 14px;
`

const MetaText = styled.span`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.labelSmall};
  `}
  color: #9E9E9E;
`

const MetaDivider = styled.span`
  color: #bdbdbd;
  opacity: 0.5;
`

// Empty State
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 8px;
`

const EmptyText = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.subtitleLarge};
  `}
  color: #1A1A1A;
  margin: 0;
  font-weight: 700;
`

const EmptySubText = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: #757575;
  margin: 0;
  text-align: center;
  line-height: 1.6;
`

const GenerateButton = styled.button`
  margin-top: 16px;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);

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
