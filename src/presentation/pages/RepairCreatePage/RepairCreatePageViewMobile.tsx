import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Header } from '@/presentation/components/Header'
import { SOORITheme } from '@/theme/soori_theme'

import { CATEGORY_KEYS, useRepairCreateViewModel } from './RepairCreatePageViewModel'

export const RepairCreatePageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="전동보장구 정비사항 작성" description="PM2024007 • 라이언" onBack={viewModel.goBack} />
      </StickyTop>
      <MainContent role="main">
        <TypeSection />
        <CategorySection />
        <PriceSection />
        <ProblemSection />
        <ActionSection />
      </MainContent>
      <CTAButtonContainer>
        <CTAButton onClick={viewModel.submitRepair} theme={theme} aria-label="정비내역 저장하기">
          정비내역 저장하기
        </CTAButton>
      </CTAButtonContainer>
    </Container>
  )
})

const TypeSection = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <Section>
      <SectionTitle id="repair-type-title">수리 이유</SectionTitle>
      <ButtonGroup role="radiogroup" aria-labelledby="repair-type-title">
        <SelectButton
          role="radio"
          aria-checked={viewModel.repairModel.type === 'accident'}
          selected={viewModel.repairModel.type === 'accident'}
          onClick={() => {
            viewModel.updateType('accident')
          }}
          theme={theme}
        >
          사고로 인한 수리예요
        </SelectButton>
        <SelectButton
          role="radio"
          aria-checked={viewModel.repairModel.type === 'routine'}
          selected={viewModel.repairModel.type === 'routine'}
          onClick={() => {
            viewModel.updateType('routine')
          }}
          theme={theme}
        >
          일상적인 수리예요
        </SelectButton>
      </ButtonGroup>
    </Section>
  )
})

const CategorySection = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <Section>
      <SectionTitle id="repair-category-title">수리 항목</SectionTitle>
      <CategoryGroup role="group" aria-labelledby="repair-category-title">
        {CATEGORY_KEYS.map((categoryKey) => (
          <CheckboxRow key={categoryKey}>
            <CheckboxInput
              type="checkbox"
              id={`category-${categoryKey}`}
              checked={viewModel.categorySelected(categoryKey)}
              onChange={() => {
                viewModel.toggleCategory(categoryKey)
              }}
              aria-checked={viewModel.categorySelected(categoryKey)}
            />
            <CheckboxLabel htmlFor={`category-${categoryKey}`} theme={theme}>
              {viewModel.getCategoryLabel(categoryKey)}
            </CheckboxLabel>
          </CheckboxRow>
        ))}
      </CategoryGroup>
    </Section>
  )
})

const PriceSection = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <Section>
      <SectionTitle id="price-title">청구 가격</SectionTitle>
      <PriceInputContainer>
        <PriceInput
          type="text"
          placeholder="청구 가격을 입력해주세요"
          value={viewModel.repairModel.price}
          onChange={(e) => {
            viewModel.updatePrice(e.target.value)
          }}
          theme={theme}
          aria-labelledby="price-title"
          inputMode="numeric"
        />
      </PriceInputContainer>
    </Section>
  )
})

const ProblemSection = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <Section>
      <SectionTitle id="problem-title">접수 문제</SectionTitle>
      <TextArea
        placeholder="접수된 문제 사항을 기록해주세요."
        value={viewModel.repairModel.problem}
        onChange={(e) => {
          viewModel.updateProblem(e.target.value)
        }}
        rows={5}
        theme={theme}
        aria-labelledby="problem-title"
      />
    </Section>
  )
})

const ActionSection = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <Section>
      <SectionTitle id="action-title">수리 사항</SectionTitle>
      <TextArea
        placeholder="수리한 사항을 기록해주세요"
        value={viewModel.repairModel.action}
        onChange={(e) => {
          viewModel.updateAction(e.target.value)
        }}
        rows={5}
        theme={theme}
        aria-labelledby="action-title"
      />
    </Section>
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
  padding: 15px 27px;
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

const CTAButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.background};
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyLarge};
  `}
`

const Section = styled.div`
  margin-bottom: 15px;
`

const SectionTitle = styled.h2`
  ${({ theme }) => css`
    ${theme.typography.labelMedium};
  `}
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 3px;
  width: 100%;
`

const SelectButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 3px 12px;
  border-radius: 6px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme; selected: boolean }) => theme.colors.primary};
  background-color: ${({ theme, selected }: { theme: SOORITheme; selected: boolean }) =>
    selected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, selected }: { theme: SOORITheme; selected: boolean }) =>
    selected ? theme.colors.onSurface : theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const PriceInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const PriceInput = styled.input`
  flex: 1;
  padding: 12px;
  height: 12px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  border-radius: 6px;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}

  &::placeholder {
    color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  border-radius: 6px;
  resize: none;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}

  &::placeholder {
    color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
  }
`

const CategoryGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  gap: 5px;
`

const CheckboxInput = styled.input`
  appearance: none;
  width: 15px;
  height: 15px;
  cursor: pointer;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:checked {
    background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
    border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  }

  &:checked::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
    border-radius: 2px;
    margin: auto;
  }
`

const CheckboxLabel = styled.label`
  cursor: pointer;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
`
