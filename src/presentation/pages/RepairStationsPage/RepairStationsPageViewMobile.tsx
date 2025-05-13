import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { ChevronRight } from '@/assets/svgs/svgs'
import { Header } from '@/presentation/components/components'
import { SOORITheme } from '@/theme/theme'

import { SortType, useRepairStationsViewModel } from './RepairStationsPageViewModel'

export const RepairStationsPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairStationsViewModel()

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="전동보장구 정비소" onBack={viewModel.goBack} />
      </StickyTop>
      <SortFilterContainer>
        <SortChip
          onClick={() => {
            viewModel.changeSort(SortType.DEFAULT)
          }}
          selected={viewModel.sortType === SortType.DEFAULT}
          theme={theme}
        >
          기본순
        </SortChip>
        <SortChip
          onClick={() => {
            viewModel.changeSort(SortType.DISTANCE)
          }}
          selected={viewModel.sortType === SortType.DISTANCE}
          theme={theme}
        >
          거리순
        </SortChip>
      </SortFilterContainer>
      <MainContent role="main">
        <StationList aria-label="정비소 목록">
          {viewModel.sortedStations.map((station) => (
            <StationItem key={station.id} theme={theme} tabIndex={0}>
              <StationName theme={theme}>{station.name}</StationName>
              <StationInfoContainer>
                <StationDistrict theme={theme}>{station.district}</StationDistrict>
                <ChevronIconContainer>
                  <ChevronRight color={theme.colors.primary} aria-hidden />
                </ChevronIconContainer>
              </StationInfoContainer>
            </StationItem>
          ))}
        </StationList>
      </MainContent>
    </Container>
  )
})

const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
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
`

const SortFilterContainer = styled.div`
  display: flex;
  padding: 12px 16px;
  gap: 10px;
  border-bottom: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
`

const SortChip = styled.button<{ selected: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
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

const StationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const StationItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
  cursor: pointer;
`

const StationName = styled.p`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.tertiary};
`

const StationInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StationDistrict = styled.span`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
`

const ChevronIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
