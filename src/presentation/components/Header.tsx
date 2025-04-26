import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'

import { ChevronLeft } from '@/assets/svgs/svgs'
import { SOORITheme } from '@/theme/soori_theme'

interface HeaderProps {
  title: string
  description: string
  onBack?: () => void
}

export function Header({ title, description, onBack }: HeaderProps) {
  const theme = useTheme()

  return (
    <HeaderContainer theme={theme} role="banner">
      <HeaderRow theme={theme}>
        {onBack && <BackButton theme={theme} onClick={onBack} />}
        <HeaderText>
          <HeaderTitle theme={theme}>{title}</HeaderTitle>
          <HeaderDescription theme={theme}>{description}</HeaderDescription>
        </HeaderText>
      </HeaderRow>
    </HeaderContainer>
  )
}

interface BackButtonProps {
  theme: SOORITheme
  onClick: () => void
}

export const BackButton = ({ theme, onClick }: BackButtonProps) => {
  return (
    <BackButtonWrapper
      onClick={onClick}
      aria-label="뒤로 가기"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick()
          e.preventDefault()
        }
      }}
    >
      <ChevronLeft width={20} height={20} color={theme.colors.onSurface} aria-hidden="true" />
    </BackButtonWrapper>
  )
}

const HeaderContainer = styled.header`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 20px 16px 6px 16px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
`

const HeaderRow = styled.div`
  display: flex;
  align-items: start;
  gap: 0 18px;
`

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const HeaderTitle = styled.h1`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.subtitleLarge};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
`

const HeaderDescription = styled.p`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.labelSmall};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
`

const BackButtonWrapper = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`
