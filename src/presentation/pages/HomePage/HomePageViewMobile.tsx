import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { Link, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { WordMark } from '@/assets/images/images'
import { SOORITheme } from '@/theme/theme'

export function HomePageViewMobile() {
  const theme = useTheme()
  const [searchParams] = useSearchParams()

  const vehicleId = searchParams.get('vehicleId') ?? ''

  return (
    <Container theme={theme}>
      <MainContent>
        <LogoTitle>
          <LogoWordMark src={WordMark} alt="수리수리 마수리" />
        </LogoTitle>
        <LoginButton to={buildRoute('SIGN_IN', {}, { vehicleId: vehicleId })} theme={theme}>
          전화번호로 로그인
        </LoginButton>
      </MainContent>
    </Container>
  )
}

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 100px 25px;
  gap: 24px 0px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.secondary};
  position: relative;
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`

const LogoTitle = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
`

const LogoWordMark = styled.img`
  width: 200px;
`

const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 270px;
  height: 45px;
  border-radius: 6px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.tertiary};
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.bodyMedium};
  `}
`
