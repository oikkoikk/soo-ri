import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Calendar, ChevronDown, Setting, User } from '@/assets/svgs/svgs'
import { REPAIR_CATEGORY_KEYS } from '@/domain/models/repair_model'
import { Header } from '@/presentation/components/Header'
import { SOORITheme } from '@/theme/soori_theme'

import { useRepairCreateViewModel } from './RepairCreatePageViewModel'

export const RepairCreatePageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="전동보장구 정비사항 작성" description="PM2024007 • 라이언" onBack={viewModel.goBack} />
      </StickyTop>
      <MainContent role="main">
        <BasicInfoSection />
        <RepairInfoSection />
      </MainContent>
      <CTAButtonContainer theme={theme}>
        <CTAButton
          onClick={viewModel.submitRepair}
          theme={theme}
          disabled={!viewModel.valid}
          aria-label="정비내역 저장하기"
          aria-disabled={!viewModel.valid}
        >
          정비내역 저장하기
        </CTAButton>
      </CTAButtonContainer>
    </Container>
  )
})

const BasicInfoSection = observer(() => {
  const theme = useTheme()

  return (
    <SectionBox>
      <SectionHeader theme={theme}>
        <IconContainer aria-hidden>
          <User width={15} height={15} color={theme.colors.onSurfaceVariant} />
        </IconContainer>
        <SectionTitle>기본정보</SectionTitle>
      </SectionHeader>
      <RepairTypeFormGroup />
      <RepairDateFormGroup />
      <RepairShopFormGroup />
      <RepairOfficerFormGroup />
    </SectionBox>
  )
})

const RepairTypeFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-type-title">수리 이유</FormLabel>
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
    </FormGroup>
  )
})

const RepairDateFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-date-title">점검일</FormLabel>
      <DateInputWrapper>
        <DateInput
          type="date"
          value={viewModel.dateInputFormatString(viewModel.repairModel.repairedAt)}
          onChange={(e) => {
            viewModel.updateRepairDate(new Date(e.target.value))
          }}
          theme={theme}
          aria-labelledby="repair-date-title"
        />
        <CalendarIconWrapper>
          <Calendar width={15} height={15} color={theme.colors.onSurfaceVariant} />
        </CalendarIconWrapper>
      </DateInputWrapper>
    </FormGroup>
  )
})

const RepairShopFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-shop-title">담당기관</FormLabel>
      <SelectWrapper>
        <SelectBox
          value={viewModel.repairModel.shopLabel}
          onChange={(e) => {
            viewModel.updateRepairShop(e.target.value)
          }}
          theme={theme}
          aria-labelledby="repair-shop-title"
        >
          <option value="">담당기관을 선택해주세요</option>
          <option value="성동장애인종합복지관">성동장애인종합복지관</option>
        </SelectBox>
        <SelectIconWrapper>
          <ChevronDown width={15} height={15} color={theme.colors.onSurfaceVariant} />
        </SelectIconWrapper>
      </SelectWrapper>
    </FormGroup>
  )
})

const RepairOfficerFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-officer-title">담당수리자</FormLabel>
      <FormInput
        type="text"
        value={viewModel.repairModel.officer}
        onChange={(e) => {
          viewModel.updateRepairOfficer(e.target.value)
        }}
        theme={theme}
        placeholder="담당수리자를 입력해주세요"
        aria-labelledby="repair-officer-title"
      />
    </FormGroup>
  )
})

const RepairInfoSection = observer(() => {
  const theme = useTheme()

  return (
    <SectionBox>
      <SectionHeader theme={theme}>
        <IconContainer aria-hidden>
          <Setting width={15} height={15} color={theme.colors.onSurfaceVariant} />
        </IconContainer>
        <SectionTitle>수리정보</SectionTitle>
      </SectionHeader>
      <RepairCategoryFormGroup />
      <BatteryVoltageFormGroup />
      <EtcRepairPartFormGroup />
      <RepairProblemFormGroup />
    </SectionBox>
  )
})

const RepairCategoryFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-category-title">수리 항목</FormLabel>
      <CategoryGrid>
        {REPAIR_CATEGORY_KEYS.map((category) => (
          <CategoryButton
            key={category}
            selected={viewModel.categorySelected(category)}
            onClick={() => {
              viewModel.toggleCategory(category)
            }}
            role="checkbox"
            aria-checked={viewModel.categorySelected(category)}
            theme={theme}
          >
            {viewModel.getCategoryLabel(category)}
          </CategoryButton>
        ))}
      </CategoryGrid>
    </FormGroup>
  )
})

const BatteryVoltageFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  if (!viewModel.hasBattery) return null

  return (
    <FormGroup>
      <FormInput
        type="text"
        value={viewModel.repairModel.batteryVoltage}
        onChange={(e) => {
          viewModel.updateBatteryVoltage(e.target.value)
        }}
        theme={theme}
        style={{
          backgroundColor: theme.colors.secondary,
          border: `0.8px solid ${theme.colors.primary}`,
        }}
        placeholder="배터리 전압을 입력해주세요"
        aria-label="배터리 전압을 입력해주세요"
      />
    </FormGroup>
  )
})

const EtcRepairPartFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  if (!viewModel.hasEtc) return null

  return (
    <FormGroup>
      <FormInput
        type="text"
        value={viewModel.repairModel.etcRepairPart}
        onChange={(e) => {
          viewModel.updateEtcRepairPart(e.target.value)
        }}
        theme={theme}
        style={{
          backgroundColor: theme.colors.secondary,
          border: `0.8px solid ${theme.colors.primary}`,
        }}
        placeholder="기타 수리 부위를 입력해주세요"
        aria-label="기타 수리 부위를 입력해주세요"
      />
    </FormGroup>
  )
})

const RepairProblemFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <TextArea
        placeholder="접수된 문제 사항을 기록해주세요."
        value={viewModel.repairModel.problem}
        onChange={(e) => {
          viewModel.updateProblem(e.target.value)
        }}
        rows={5}
        theme={theme}
        aria-label="접수된 문제 사항을 기록해주세요."
      />
    </FormGroup>
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
  padding-bottom: 80px; /* 하단 버튼 높이만큼 패딩 추가 */
`

const SectionBox = styled.div`
  margin-bottom: 40px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  gap: 8px;
  padding: 7px 13px;
  border-radius: 12px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.outlineVariant};
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const SectionTitle = styled.h2`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
  `}
`

const FormGroup = styled.div`
  padding: 0 11px;
  margin-bottom: 13px;
`

const FormLabel = styled.label`
  display: block;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const FormInput = styled.input`
  width: 100%;
  padding: 3px 12px;
  height: 42px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  border-radius: 6px;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}

  &::placeholder {
    color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
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

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 100px));
  gap: 10px;
  justify-content: center;
`

const CategoryButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 3px 12px;
  border-radius: 6px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme; selected: boolean }) => theme.colors.outline};
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
  background-color: ${({ theme, disabled }: { theme: SOORITheme; disabled: boolean }) =>
    disabled ? theme.colors.onSurfaceVariant : theme.colors.primary};
  color: ${({ theme, disabled }: { theme: SOORITheme; disabled?: boolean }) =>
    disabled ? theme.colors.onSurface : theme.colors.background};
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyLarge};
  `}
  transition: all 0.2s ease;

  &:disabled {
    cursor: not-allowed;
  }
`

const DateInputWrapper = styled.div`
  position: relative;
  width: 100%;
`

const DateInput = styled.input`
  width: 100%;
  padding: 3px 12px;
  height: 42px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  border-radius: 6px;
  position: relative;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  text-align: left;

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    color: transparent;
    cursor: pointer;
  }

  &::placeholder {
    color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
  }
`

const CalendarIconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  bottom: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`

const SelectBox = styled.select`
  width: 100%;
  padding: 3px 12px;
  height: 42px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  border-radius: 6px;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;

  &::placeholder {
    color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
  }
`

const SelectIconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  bottom: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`
