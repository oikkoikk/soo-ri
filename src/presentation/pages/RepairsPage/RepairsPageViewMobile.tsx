import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { Calendar, ChevronRight, Search } from '@/assets/svgs/svgs'
import { RepairModel } from '@/domain/models/models'
import { Header, Tabs } from '@/presentation/components/components'
import { SOORITheme } from '@/theme/soori_theme'

import { TabId, useRepairsViewModel } from './RepairsPageViewModel'

export const RepairsPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairsViewModel()

  return (
    <>
      {(() => {
        if (viewModel.modalOpened) {
          return <AuthModal />
        } else {
          return (
            <Container>
              <StickyTop theme={theme}>
                <Header title="전동보장구 정비이력" description="PM2024007 • 라이언" onBack={viewModel.goBack} />
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
              <CTAButtonContainer>
                <CTAButton onClick={viewModel.goRepairCreatePage} theme={theme} aria-label="새 정비 작업 시작하기">
                  + 새 정비 작업 시작
                </CTAButton>
              </CTAButtonContainer>
            </Container>
          )
        }
      })()}
    </>
  )
})

const AuthModal = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairsViewModel()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      viewModel.submitAuthCode()
    }
  }

  return (
    <Modal theme={theme} role="dialog" aria-labelledby="auth-modal-title">
      <ModalContent theme={theme}>
        <ModalTitle id="auth-modal-title" theme={theme}>
          인증번호를 입력하세요
        </ModalTitle>
        <ModalDescription theme={theme} id="auth-description">
          인증번호를 모르는 경우 정비이력 업데이트 권한을 부여받은 기관에 문의바랍니다.
        </ModalDescription>
        <ModalInput
          autoFocus
          theme={theme}
          type="password"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={4}
          value={viewModel.authCode}
          onChange={(e) => {
            viewModel.updateAuthCode(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          autoComplete="one-time-code"
          aria-describedby="auth-description"
        />
        <ModalCTAButton onClick={viewModel.submitAuthCode} theme={theme} aria-label="인증번호 확인">
          확인
        </ModalCTAButton>
      </ModalContent>
    </Modal>
  )
})

const SearchBar = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairsViewModel()

  return (
    <SearchBarOuterContainer theme={theme}>
      <SearchBarInnerContainer theme={theme}>
        <SearchIcon aria-hidden="true">
          <Search color={theme.colors.onSurfaceVariant} />
        </SearchIcon>
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
    <RepairCard
      to={buildRoute('REPAIR_DETAIL', { id: repair.id }, { vehicleId: viewModel.vehicleId })}
      theme={theme}
      tabIndex={0}
    >
      <RepairCardHeader theme={theme}>
        <RepairDateContainer>
          <CalendarIcon aria-hidden="true">
            <Calendar color={theme.colors.onSurfaceVariant} />
          </CalendarIcon>
          <RepairDate theme={theme}>{repair.repairedAtDisplayString}</RepairDate>
        </RepairDateContainer>
        <RepairPriceContainer>
          <RepairPrice theme={theme}>{repair.priceDisplayString}</RepairPrice>
          <ChevronIcon aria-hidden="true">
            <ChevronRight color={theme.colors.primary} />
          </ChevronIcon>
        </RepairPriceContainer>
      </RepairCardHeader>
      <RepairTypeBadge theme={theme}>{repair.type}</RepairTypeBadge>
      <RepairShop theme={theme}>담당기관: {repair.shopLabel}</RepairShop>
    </RepairCard>
  )
}

const Vehicle = () => {
  return <></>
}

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }: { theme: SOORITheme }) => theme.colors.outlineVariant};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`

const ModalContent = styled.div`
  width: 270px;
  height: 184px;
  background: ${({ theme }: { theme: SOORITheme }) => theme.colors.background};
  border-radius: 14px;
  text-align: center;
  display: flex;
  gap: 2px;
  flex-direction: column;
`

const ModalTitle = styled.h2`
  ${({ theme }) => css`
    ${theme.typography.subtitleMedium};
  `}
  padding: 19px 16px 0px 16px;
`

const ModalDescription = styled.p`
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  padding: 0px 16px 15px 16px;
`

const ModalInput = styled.input`
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.background};
  height: 44px;
  padding: 11px 0px;
  border: none;
  border-top: 0.3px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  border-bottom: 0.3px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  width: 100%;
  text-align: center;
  &:focus {
    outline: none;
    background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.secondary};
  }
&
`

const ModalCTAButton = styled.button`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  height: 44px;
  padding: 0px 16px;
  &:focus {
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
  }
`

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

const SearchIcon = styled.span`
  display: flex;
  align-items: center;
`

const CalendarIcon = styled.span`
  display: flex;
  align-items: center;
`

const ChevronIcon = styled.span`
  display: flex;
  align-items: center;
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
