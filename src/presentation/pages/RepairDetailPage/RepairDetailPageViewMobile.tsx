import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'

import { Header } from '@/presentation/components/Header'
import { SOORITheme } from '@/theme/soori_theme'

import { useRepairDetailViewModel } from './RepairDetailPageViewModel'

export function RepairDetailPageViewMobile() {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="전동보장구 정비이력 확인" description={'PM2024007 • 라이언'} onBack={viewModel.goBack} />
      </StickyTop>
      <MainContent role="main">
        <ProblemSection problemText={viewModel.repairModel.problem} />
        <ActionSection actionText={viewModel.repairModel.action} />
      </MainContent>
    </Container>
  )
}

const ProblemSection = ({ problemText }: { problemText: string }) => {
  return (
    <Section>
      <SectionTitle id="problem-title">접수 문제</SectionTitle>
      <TextArea readOnly value={problemText} rows={7} aria-labelledby="problem-title" aria-readonly="true" />
    </Section>
  )
}

const ActionSection = ({ actionText }: { actionText: string }) => {
  return (
    <Section>
      <SectionTitle id="repair-title">수리사항</SectionTitle>
      <TextArea readOnly value={actionText} rows={7} aria-labelledby="repair-title" aria-readonly="true" />
    </Section>
  )
}

const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px; /* 하단 버튼 높이만큼 패딩 추가 */
`

const StickyTop = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.background};
`

const MainContent = styled.section`
  flex: 1;
  padding: 15px 27px;
`

const Section = styled.div`
  margin-bottom: 15px;
`

const SectionTitle = styled.h2`
  ${({ theme }) => css`
    ${theme.typography.labelMedium};
  `}
  color: ${({ theme }) => theme.colors.primary};
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  border-radius: 6px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.secondary};
  resize: none;
  &:focus {
    outline: none;
    border-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  }
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
`
