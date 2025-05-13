import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Header } from '@/presentation/components/components'
import { SOORITheme } from '@/theme/theme'

import { useVehicleTestViewModel } from './VehicleTestPageViewModel'

export const VehicleTestPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useVehicleTestViewModel()

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="나의 전동보장구 자가점검" onBack={viewModel.goBack} />
      </StickyTop>
      <MainContent role="main">
        <TestItemList aria-label="자가점검 항목 목록">
          {viewModel.testItems.map((item) => (
            <TestItem key={item.id} theme={theme}>
              <TestItemNumber theme={theme}>{item.id}</TestItemNumber>
              <TestItemRow>
                <TestItemQuestion theme={theme}>{item.question}</TestItemQuestion>
                <TestItemAnswers>
                  <AnswerButton
                    selected={item.answer === true}
                    onClick={() => {
                      viewModel.setAnswer(item.id, true)
                    }}
                    theme={theme}
                    aria-pressed={item.answer === true}
                  >
                    그렇다
                  </AnswerButton>
                  <AnswerButton
                    selected={item.answer === false}
                    onClick={() => {
                      viewModel.setAnswer(item.id, false)
                    }}
                    theme={theme}
                    aria-pressed={item.answer === false}
                  >
                    아니다
                  </AnswerButton>
                </TestItemAnswers>
              </TestItemRow>
            </TestItem>
          ))}
        </TestItemList>
      </MainContent>
      <CTAButtonContainer theme={theme}>
        <CTAButton
          onClick={viewModel.saveTestResults}
          disabled={!viewModel.allItemsAnswered}
          theme={theme}
          aria-disabled={!viewModel.allItemsAnswered}
        >
          점검사항 저장하기
        </CTAButton>
      </CTAButtonContainer>
    </Container>
  )
})

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
  padding: 15px 16px;
`

const TestItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const TestItem = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
`

const TestItemNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
  margin-right: 12px;
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
`

const TestItemRow = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TestItemQuestion = styled.p`
  flex: 1;
  padding-right: 10px;
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
  word-break: keep-all;
`

const TestItemAnswers = styled.div`
  display: flex;
  gap: 10px;
`

const AnswerButton = styled.button<{ selected: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: 0.8px solid
    ${({ theme, selected }: { theme: SOORITheme; selected: boolean }) =>
      selected ? theme.colors.primary : theme.colors.outline};
  background-color: ${({ theme, selected }: { theme: SOORITheme; selected: boolean }) =>
    selected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, selected }: { theme: SOORITheme; selected: boolean }) =>
    selected ? theme.colors.onSurface : theme.colors.onSurfaceVariant};
  cursor: pointer;
  transition: all 0.2s ease;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const CTAButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  padding: 12px 25px;
  z-index: 5;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.surfaceContainer};
  border-top: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
`

const CTAButton = styled.button<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: none;
  background-color: ${({ theme, disabled }: { theme: SOORITheme; disabled: boolean }) =>
    disabled ? theme.colors.onSurfaceVariant : theme.colors.primary};
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.background};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyLarge};
  `}
`
