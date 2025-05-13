import { useEffect } from 'react'

import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router'

import { Add, Calendar, Cancel, Check, ChevronRight, Map, Search } from '@/assets/svgs/svgs'
import { RepairModel } from '@/domain/models/models'
import { Header, Tabs } from '@/presentation/components/components'
import { SOORITheme } from '@/theme/theme'

import { TabId, useRepairsViewModel } from './RepairsPageViewModel'

export const RepairsPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairsViewModel()

  useEffect(() => {
    return () => {
      viewModel.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="전동보장구 정비이력" description="PM2024007 • 라이언" />
        <Tabs
          activeTab={viewModel.activeTab as string}
          setActiveTab={(tabId: string) => {
            viewModel.changeTab(tabId as TabId)
          }}
          tabs={viewModel.tabItems}
        />
        <SearchBar />
      </StickyTop>
      <MainContent role="main">
        {(() => {
          if (viewModel.activeTab === TabId.REPAIRS) {
            return <RepairHistoryList />
          } else {
            return <Vehicle />
          }
        })()}
      </MainContent>
      <FloatingActionMenu />
      <CTAButtonContainer>
        <CTAButton to={viewModel.buildRouteForRepairCreatePage()} theme={theme} aria-label="새 정비 작업 시작하기">
          + 새 정비 작업 시작
        </CTAButton>
      </CTAButtonContainer>
      {viewModel.fabExpended && <ModalOverlay onClick={viewModel.toggleFab} />}
    </Container>
  )
})

const FloatingActionMenu = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairsViewModel()

  return (
    <FloatingMenuContainer>
      {(() => {
        if (viewModel.fabExpended) {
          return (
            <>
              <MenuItemContainer>
                <MenuItemContainer>
                  <MenuItem to={viewModel.buildRouteForRepairStationsPage()} theme={theme}>
                    <MenuItemIconContainer theme={theme}>
                      <Map width={25} height={25} color={theme.colors.onSurface} aria-hidden />
                    </MenuItemIconContainer>
                    <MenuItemText theme={theme}>근처 정비소 찾기</MenuItemText>
                  </MenuItem>
                </MenuItemContainer>
                <MenuItem to={viewModel.buildRouteForVehicleTestPage()} theme={theme}>
                  <MenuItemIconContainer theme={theme}>
                    <Check width={20} height={20} color={theme.colors.onSurface} aria-hidden />
                  </MenuItemIconContainer>
                  <MenuItemText theme={theme}>나의 전동보장구 자가점검</MenuItemText>
                </MenuItem>
              </MenuItemContainer>
            </>
          )
        }
      })()}
      <FABContainer
        onClick={viewModel.toggleFab}
        aria-label={viewModel.fabExpended ? '메뉴 닫기' : '메뉴 열기'}
        theme={theme}
        fabExpended={viewModel.fabExpended}
      >
        {(() => {
          if (viewModel.fabExpended) {
            return <Cancel width={15} height={15} color={theme.colors.primary} aria-hidden />
          } else {
            return <Add width={15} height={15} color={theme.colors.onSurface} aria-hidden />
          }
        })()}
      </FABContainer>
    </FloatingMenuContainer>
  )
})

const SearchBar = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairsViewModel()

  return (
    <SearchBarOuterContainer theme={theme}>
      <SearchBarInnerContainer theme={theme}>
        <IconContainer aria-hidden>
          <Search color={theme.colors.onSurfaceVariant} />
        </IconContainer>
        <SearchInput
          theme={theme}
          type="text"
          placeholder="정비 내역 검색"
          value={viewModel.searchKeyword}
          onChange={(e) => {
            viewModel.updateSearchKeyword(e.target.value)
          }}
          aria-label="정비 내역 검색"
        />
      </SearchBarInnerContainer>
    </SearchBarOuterContainer>
  )
})

const RepairHistoryList = observer(() => {
  const viewModel = useRepairsViewModel()

  return (
    <RepairList aria-label="정비 이력 목록">
      {viewModel.filteredRepairs.map((repair) => (
        <RepairHistoryItem key={repair.id} repair={repair} />
      ))}
    </RepairList>
  )
})

interface RepairItemProps {
  repair: RepairModel
}

const RepairHistoryItem = ({ repair }: RepairItemProps) => {
  const theme = useTheme()
  const viewModel = useRepairsViewModel()

  return (
    <RepairCard to={viewModel.buildRouteForRepairDetailPage(repair.id)} theme={theme} tabIndex={0}>
      <RepairCardHeader theme={theme}>
        <RepairDateContainer>
          <IconContainer aria-hidden>
            <Calendar color={theme.colors.onSurfaceVariant} />
          </IconContainer>
          <RepairDate theme={theme}>{repair.repairedAtDisplayString}</RepairDate>
        </RepairDateContainer>
        <RepairPriceContainer>
          <RepairPrice theme={theme}>{repair.priceDisplayString}</RepairPrice>
          <IconContainer aria-hidden>
            <ChevronRight color={theme.colors.primary} />
          </IconContainer>
        </RepairPriceContainer>
      </RepairCardHeader>
      <RepairTypeBadge theme={theme}>{repair.type}</RepairTypeBadge>
      <RepairShop theme={theme}>담당기관: {repair.shopLabel}</RepairShop>
    </RepairCard>
  )
}

const Vehicle = () => {
  const theme = useTheme()
  const viewModel = useRepairsViewModel()

  return (
    <VehicleCard theme={theme}>
      <VehicleInfoRow>
        <VehicleInfoLabel>모델명</VehicleInfoLabel>
        <VehicleInfoValue>{viewModel.vehicle.model}</VehicleInfoValue>
      </VehicleInfoRow>
      <Divider aria-hidden />
      <VehicleInfoRow>
        <VehicleInfoLabel>등록일</VehicleInfoLabel>
        <VehicleInfoValue>{viewModel.vehicle.registeredAtDisplayString}</VehicleInfoValue>
      </VehicleInfoRow>
      <Divider aria-hidden />
      <VehicleInfoRow>
        <VehicleInfoLabel>구매일</VehicleInfoLabel>
        <VehicleInfoValue>{viewModel.vehicle.purchasedAtDisplayString}</VehicleInfoValue>
      </VehicleInfoRow>
      <Divider aria-hidden />
      <VehicleInfoRow>
        <VehicleInfoLabel>누적 수리횟수</VehicleInfoLabel>
        <VehicleInfoValue>{viewModel.totalRepairsCountDisplayString}</VehicleInfoValue>
      </VehicleInfoRow>
      <Divider aria-hidden />
      <VehicleInfoRow>
        <VehicleInfoLabel>이번달 수리비 합계</VehicleInfoLabel>
        <VehicleInfoValue style={{ color: theme.colors.primary }}>
          {viewModel.repairPriceSumThisMonthDisplayString}
        </VehicleInfoValue>
      </VehicleInfoRow>
      <Divider aria-hidden />
    </VehicleCard>
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
`

const SearchBarOuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 46px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.surfaceContainer};
  padding: 8px 11px;
  border-bottom: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
`

const SearchBarInnerContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 7px 10px;
  border-radius: 12px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const SearchInput = styled.input`
  flex: 1;
  height: 16px;
  border: none;
  padding: 8px;
  background-color: transparent;
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.tertiary};

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

const CTAButton = styled(Link)`
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

const RepairList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const RepairCard = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100px;
  gap: 11px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
  padding: 15px 21px;
  border-bottom: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
`

const RepairCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15px;
`

const RepairDateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`

const RepairDate = styled.span`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
`

const RepairPriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const RepairPrice = styled.p`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
`

const RepairTypeBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 16px;
  margin: 1px 0px;
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  border-radius: 4px;
  border: 0.8px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const RepairShop = styled.p`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
  height: 15px;
`

const VehicleCard = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 26px;
  padding: 15px 12px 45px 12px;
  border-radius: 24px;
  border: 1px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
`

const VehicleInfoRow = styled.dl`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 10px;
`

const VehicleInfoLabel = styled.dt`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
`

const VehicleInfoValue = styled.dd`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
`

const Divider = styled.div`
  width: 100%;
  height: 0.8px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
`

const FloatingMenuContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 15;
`

const MenuItemContainer = styled.div`
  margin-bottom: 10px;
  animation: slideUp 0.3s ease-out forwards;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0px 16px 0px 0px;
  background-color: transparent;
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  cursor: pointer;
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
`

const MenuItemIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
`

const MenuItemText = styled.span`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
`

const FABContainer = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: ${({ theme, fabExpended }: { theme: SOORITheme; fabExpended?: boolean }) => {
    if (fabExpended) {
      return theme.colors.outlineVariant
    } else {
      return theme.colors.primary
    }
  }};
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.background};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease;
  z-index: 15;

  &:hover {
    transform: scale(1.05);
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.3s ease-out forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
