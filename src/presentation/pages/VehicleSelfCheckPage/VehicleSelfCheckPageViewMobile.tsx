import { css, useTheme, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Header } from '@/presentation/components/components'

import { useVehicleSelfCheckViewModel } from './VehicleSelfCheckPageViewModel'

export const VehicleSelfCheckPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useVehicleSelfCheckViewModel()

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="나의 전동보장구 자가점검" onBack={viewModel.goBack} />
      </StickyTop>
      <MainContent>
        <SelfCheckItemList aria-label="자가점검 항목 목록">
          {viewModel.selfCheckItems.map((item, index) => (
            <SelfCheckItem key={item.id} theme={theme}>
              <SelfCheckItemNumber theme={theme} answered={item.answer !== null}>
                {index + 1}
              </SelfCheckItemNumber>
              <SelfCheckItemRow>
                <SelfCheckItemQuestion theme={theme} id={`question-${item.id}`}>
                  {item.question}
                </SelfCheckItemQuestion>
                <RadioGroupContainer role="radiogroup" aria-labelledby={`question-${item.id}`}>
                  <RadioButtonGroup>
                    <RadioButton
                      type="radio"
                      id={`radio-yes-${item.id}`}
                      name={`radio-${item.id}`}
                      value="true"
                      checked={item.answer === true}
                      onChange={() => {
                        viewModel.setAnswer(item.id, true)
                      }}
                      aria-checked={item.answer === true}
                    />
                    <RadioButtonLabel htmlFor={`radio-yes-${item.id}`} theme={theme} selected={item.answer === true}>
                      그렇다
                    </RadioButtonLabel>
                  </RadioButtonGroup>
                  <RadioButtonGroup>
                    <RadioButton
                      type="radio"
                      id={`radio-no-${item.id}`}
                      name={`radio-${item.id}`}
                      value="false"
                      checked={item.answer === false}
                      onChange={() => {
                        viewModel.setAnswer(item.id, false)
                      }}
                      aria-checked={item.answer === false}
                    />
                    <RadioButtonLabel htmlFor={`radio-no-${item.id}`} theme={theme} selected={item.answer === false}>
                      아니다
                    </RadioButtonLabel>
                  </RadioButtonGroup>
                </RadioGroupContainer>
              </SelfCheckItemRow>
            </SelfCheckItem>
          ))}
        </SelfCheckItemList>
      </MainContent>
      <CTAButtonContainer theme={theme}>
        <CTAButton
          onClick={() => {
            void viewModel.saveSelfCheckResults()
          }}
          disabled={!viewModel.allItemsAnswered || viewModel.submitting}
          theme={theme}
          aria-disabled={!viewModel.allItemsAnswered || viewModel.submitting}
        >
          {viewModel.submitting ? '저장 중...' : '점검사항 저장하기'}
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
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.background};
`

const MainContent = styled.section`
  flex: 1;
  padding: 15px 16px;
`

const SelfCheckItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const SelfCheckItem = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
`

const SelfCheckItemNumber = styled.span<{ theme: Theme; answered?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme, answered }) => (answered ? theme.colors.primary : theme.colors.outline)};
  color: ${({ theme, answered }) => (answered ? theme.colors.onSurface : theme.colors.background)};
  margin-right: 12px;
  font-size: 12px;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const SelfCheckItemRow = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SelfCheckItemQuestion = styled.p`
  flex: 1;
  padding-right: 10px;
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  word-break: keep-all;
`

const RadioGroupContainer = styled.div`
  display: flex;
  gap: 10px;
`

// 라디오 버튼 그룹 컴포넌트
const RadioOptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
`

// 실제 라디오 버튼
const RadioInput = styled.input`
  margin: 0;
  cursor: pointer;
  accent-color: ${({ theme }: { theme?: Theme }) => theme?.colors.primary ?? '#007AFF'};
`

// 라디오 버튼 라벨
const RadioLabel = styled.label<{ theme: Theme; selected?: boolean }>`
  display: flex;
  padding: 4px 0;
  cursor: pointer;
  color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.onSurfaceVariant)};
  font-weight: ${({ selected }) => (selected ? 500 : 400)};
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
  transition: all 0.2s ease;
`

const RadioButtonGroup = RadioOptionGroup
const RadioButton = RadioInput
const RadioButtonLabel = RadioLabel

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
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.surfaceContainer};
  border-top: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
`

const CTAButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: none;
  background-color: ${({ theme, disabled }: { theme: Theme; disabled: boolean }) => {
    if (disabled) {
      return theme.colors.onSurfaceVariant
    } else {
      return theme.colors.primary
    }
  }};
  color: ${({ theme }: { theme: Theme }) => theme.colors.background};
  opacity: ${({ disabled }: { disabled: boolean }) => {
    if (disabled) {
      return 0.6
    } else {
      return 1
    }
  }};
  cursor: ${({ disabled }: { disabled: boolean }) => {
    if (disabled) {
      return 'not-allowed'
    } else {
      return 'pointer'
    }
  }};
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyLarge};
  `}
`
