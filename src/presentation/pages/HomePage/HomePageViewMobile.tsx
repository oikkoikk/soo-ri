import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router'

import { SOORITheme } from '@/theme/theme'

export function HomePageViewMobile() {
  const theme = useTheme()
  return (
    <Container theme={theme}>
      <Title theme={theme}>전동보장구 관리 서비스</Title>
      {/* TODO: 카카오 아이콘 추가 */}
      {/* TODO: 카카오 로그인 페이지로 연결 */}
      <KakaoLoginButton to="/kakao">
        <ButtonText theme={theme}>카카오 로그인</ButtonText>
      </KakaoLoginButton>
      <RepairModeButton to="/repair">
        <ButtonText theme={theme}>수리자 모드 바로가기</ButtonText>
      </RepairModeButton>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 47px;
  gap: 24px 0px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.tertiary};
  position: relative;
`

const Title = styled.h1`
  ${({ theme }) => css`
    ...${theme.typography.titleLarge};
    color: ${theme.colors.onSurface};
  `}
`

const KakaoLoginButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  background-color: #fee500;
  border-radius: 6px;
  text-decoration: none;
  border: none;
  cursor: pointer;
`

const RepairModeButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  background-color: #ffffff;
  border-radius: 6px;
  text-decoration: none;
  border: none;
  cursor: pointer;
`

const ButtonText = styled.span`
  ${({ theme }) => css`
    ...${theme.typography.bodyMedium};
  `}
`
