import { useState } from 'react'

import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router'

import { SOORITheme } from '@/theme/soori_theme'

export function RepairsPageViewMobile() {
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(!!searchParams.get('id'))
  const [authCode, setAuthCode] = useState('')

  const submitAuthCode = () => {
    // TODO: 인증번호 확인 및 제출
    if (authCode.length !== 4) {
      alert('인증번호는 4자리여야 합니다.')
      return
    }
    setIsModalOpen(false)
    setAuthCode('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitAuthCode()
    }
  }

  return (
    <>
      {isModalOpen && (
        <Modal theme={theme}>
          <ModalContent theme={theme}>
            <ModalTitle theme={theme}>인증번호를 입력하세요</ModalTitle>
            <ModalDescription theme={theme}>
              인증번호를 모르는 경우 정비이력 업데이트 권한을 부여받은 기관에 문의바랍니다.
            </ModalDescription>
            <StyledInput
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={4}
              value={authCode}
              onChange={(e) => {
                setAuthCode(e.target.value)
              }}
              onKeyDown={handleKeyDown}
              theme={theme}
            />
            <StyledButton onClick={submitAuthCode} theme={theme}>
              확인
            </StyledButton>
          </ModalContent>
        </Modal>
      )}
      {!isModalOpen && <></>}
    </>
  )
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

const ModalTitle = styled.p`
  ${({ theme }) => css`
    ...${theme.typography.subtitleMedium};
  `}
  padding: 19px 16px 0px 16px;
  margin: 0;
`

const ModalDescription = styled.p`
  ${({ theme }) => css`
    ...${theme.typography.bodySmall};
  `}
  padding: 0px 16px 15px 16px;
  margin: 0;
`

const StyledInput = styled.input`
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.background};
  height: 44px;
  padding: 11px 0px;
  border: none;
  border-top: 0.3px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  border-bottom: 0.3px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.outline};
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
  width: 100%;
  text-align: center;
`

const StyledButton = styled.button`
  ${({ theme }: { theme: SOORITheme }) => css`
    ...${theme.typography.bodyMedium};
    color: ${theme.colors.primary};
  `}
  height: 22px;
  padding: 11px 16px;
`
