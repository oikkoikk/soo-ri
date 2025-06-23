import { css, useTheme, Theme } from '@emotion/react'
import styled from '@emotion/styled'

import { KaKaoImpactWordmark, SDCommunityWelfareCenterWordmark, StarPickersWordmark } from '@/assets/images/images'

export function Footer() {
  const theme = useTheme()

  return (
    <Container theme={theme} role="contentinfo" aria-label="페이지 푸터">
      <Description theme={theme}>
        본 서비스는 카카오임팩트의 기술 이니셔티브{' '}
        <Link
          href="https://techforimpact.io/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="테크포임팩트 웹사이트 (새 창에서 열림)"
        >
          테크포임팩트
        </Link>
        의 지원으로 개발되었습니다.
      </Description>
      <PartnersSection>
        <PartnersTitle theme={theme}>함께하신분들</PartnersTitle>
        <LogoContainer role="list">
          <LogoItem role="listitem">
            <img src={SDCommunityWelfareCenterWordmark} alt="성동종합사회복지관" />
          </LogoItem>
          <LogoItem role="listitem">
            <img src={KaKaoImpactWordmark} alt="카카오임팩트" />
          </LogoItem>
          <LogoItem role="listitem">
            <img src={StarPickersWordmark} alt="별따러가자" />
          </LogoItem>
        </LogoContainer>
      </PartnersSection>
    </Container>
  )
}

const Container = styled.footer`
  background-color: #f5f3e6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 16px;
  text-align: center;
`

const Description = styled.div`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodySmall};
  `}
  word-break: keep-all;
  margin-bottom: 8px;
`

const Link = styled.a`
  color: inherit;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    outline: 2px solid ${({ theme }: { theme: Theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }
`

const PartnersSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PartnersTitle = styled.h2`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodySmall};
  `}
  margin: 16px 0 8px 0;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const LogoItem = styled.div`
  img {
    height: 20px;
    display: block;
  }
`
