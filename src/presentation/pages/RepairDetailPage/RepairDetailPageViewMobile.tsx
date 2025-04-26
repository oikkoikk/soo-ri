import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

import { Header } from '@/presentation/components/Header'
import { SOORITheme } from '@/theme/soori_theme'

export function RepairDetailPageViewMobile() {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header
          title="전동보장구 정비이력 확인"
          description="PM2024007 • 라이언"
          onBack={() => {
            void navigate(-1)
          }}
        />
      </StickyTop>
      <MainContent role="main">
        <Section>
          <SectionTitle>접수 문제</SectionTitle>
          <TextArea disabled value={'파손부위 점검 후 수리 요청'} rows={5} />
        </Section>
        <Section>
          <SectionTitle>수리사항</SectionTitle>
          <TextArea disabled value={'브레이크 및 타이어 휠 파손 확인 후 교체 조치'} rows={5} />
        </Section>
      </MainContent>
    </Container>
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
    color: ${theme.colors.primary};
  `}
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
