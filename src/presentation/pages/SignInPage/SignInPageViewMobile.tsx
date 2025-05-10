import { useEffect } from 'react'

import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { RECAPTCHA_VERIFIER_ID } from '@/domain/use_cases/use_cases'
import { Header } from '@/presentation/components/components'
import { SOORITheme } from '@/theme/soori_theme'

import { useSignInViewModel } from './SignInPageViewModel'

export const SignInPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useSignInViewModel()

  useEffect(() => {
    viewModel.init()
    return () => {
      viewModel.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewModel.init, viewModel.reset])

  return (
    <Container>
      <Header title="번호 인증" onBack={viewModel.goBack} />
      <MainContent>
        <PhoneInputFormGroup />
        <VerificationInputFormGroup />
      </MainContent>
      <CTAButtonContainer>
        <CTAButton
          onClick={viewModel.redirectToPreviousPage}
          theme={theme}
          disabled={!viewModel.valid}
          aria-disabled={!viewModel.valid}
        >
          완료
        </CTAButton>
      </CTAButtonContainer>
    </Container>
  )
})

const PhoneInputFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useSignInViewModel()

  return (
    <FormGroup>
      <FormLabel>휴대전화번호</FormLabel>
      <InputGroup>
        <PhoneInput
          autoFocus
          type="tel"
          inputMode="tel"
          value={viewModel.phoneNumber}
          onChange={(e) => {
            viewModel.updatePhoneNumber(e.target.value)
          }}
          onKeyDown={viewModel.handlePhoneInputKeyDown}
          placeholder="휴대전화번호를 입력해주세요"
          disabled={viewModel.verificationCodeRequested}
        />
        <RequestButton
          theme={theme}
          onClick={async () => {
            await viewModel.requestVerification()
          }}
          disabled={!viewModel.canRequestVerification}
          aria-disabled={!viewModel.canRequestVerification}
        >
          <RecaptchaVerifier id={RECAPTCHA_VERIFIER_ID} tabIndex={-1} />
          {'인증번호 요청'}
        </RequestButton>
      </InputGroup>
    </FormGroup>
  )
})

const VerificationInputFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useSignInViewModel()

  if (!viewModel.verificationCodeRequested) return null
  return (
    <FormGroup>
      <InputGroup>
        <VerificationInputContainer
          theme={theme}
          error={!!viewModel.errorMessage}
          aria-invalid={!!viewModel.errorMessage}
        >
          <VerificationInput
            autoFocus
            type="text"
            inputMode="decimal"
            value={viewModel.verificationCode}
            onChange={(e) => {
              void viewModel.updateVerificationCode(e.target.value)
            }}
            onKeyDown={viewModel.handleVerificationCodeKeyDown}
            placeholder={`${viewModel.VERIFICATION_CODE_LENGTH.toString()}자리 인증번호`}
            maxLength={viewModel.VERIFICATION_CODE_LENGTH}
            disabled={viewModel.timerExpired || viewModel.verified}
            aria-label={`${viewModel.VERIFICATION_CODE_LENGTH.toString()}자리 인증번호 입력`}
            aria-describedby={viewModel.errorMessage ? 'verification-error' : undefined}
          />
          {(() => {
            if (viewModel.timerActive && !viewModel.verified) {
              return (
                <Timer theme={theme} expired={viewModel.timerExpired} aria-live="polite">
                  <VisibleOnly aria-hidden>{viewModel.expirationTimeDisplayString}</VisibleOnly>
                  <ScreenReaderOnly>{viewModel.expirationTimeScreenReaderString}</ScreenReaderOnly>
                </Timer>
              )
            }
          })()}
        </VerificationInputContainer>
        <RequestButton
          theme={theme}
          onClick={async () => {
            await viewModel.verifyCode()
          }}
          disabled={!viewModel.canVerifyCode}
          aria-disabled={!viewModel.canVerifyCode}
        >
          인증번호 확인
        </RequestButton>
      </InputGroup>
      {(() => {
        if (viewModel.errorMessage)
          return (
            <ErrorMessage id="verification-error" aria-live="assertive">
              *{viewModel.errorMessage}
            </ErrorMessage>
          )
      })()}
    </FormGroup>
  )
})

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const MainContent = styled.div`
  flex: 1;
  padding: 28px 27px;
  padding-bottom: 80px; /* 하단 버튼 높이만큼 패딩 추가 */
`

const FormGroup = styled.div`
  margin-bottom: 12px;
`

const FormLabel = styled.label`
  display: block;
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const InputGroup = styled.div`
  display: flex;
`

const PhoneInput = styled.input`
  flex: 1;
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

const VerificationInputContainer = styled.div`
  flex: 1;
  position: relative;
  padding: 3px 12px;
  height: 42px;
  border: 0.8px solid
    ${({ theme, error }: { theme: SOORITheme; error: boolean }) => (error ? theme.colors.error : theme.colors.outline)};
  border-radius: 6px;
  display: flex;
  align-items: center;

  &:focus-within {
    border-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.tertiary};
    outline: 2px solid ${({ theme }: { theme: SOORITheme }) => theme.colors.tertiary};
    outline-offset: -1px;
  }
`

const VerificationInput = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}

  &::placeholder {
    color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurfaceVariant};
  }

  &:focus {
    outline: none;
  }
`

const Timer = styled.div`
  ${({ theme }: { theme: SOORITheme }) => theme.typography.bodyMedium};
  color: ${({ theme, expired }: { theme: SOORITheme; expired: boolean }) =>
    expired ? theme.colors.error : theme.colors.primary};
`

const VisibleOnly = styled.span``

const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`

const ErrorMessage = styled.p`
  margin-top: 2px;
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.error};
  ${({ theme }: { theme: SOORITheme }) => theme.typography.labelSmall};
`

const RequestButton = styled.button`
  flex: 0 0 100px;
  width: 100px;
  height: 42px;
  margin-left: 9px;
  padding: 0 8px;
  border-radius: 6px;
  border: none;
  background-color: ${({ theme, disabled }: { theme: SOORITheme; disabled: boolean }) =>
    disabled ? theme.colors.onSurfaceVariant : theme.colors.primary};
  color: ${({ theme, disabled }: { theme: SOORITheme; disabled: boolean }) =>
    disabled ? theme.colors.outlineVariant : theme.colors.onSurface};
  ${({ theme }: { theme: SOORITheme }) => theme.typography.bodyMedium};

  &:disabled {
    cursor: not-allowed;
  }
`

const RecaptchaVerifier = styled.span`
  display: none;
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
