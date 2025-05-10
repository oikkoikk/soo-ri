import { ConfirmationResult, getAuth } from 'firebase/auth'
import { makeAutoObservable, runInAction } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { AuthPhoneVerifyUseCase, AuthPhoneConfirmUseCase } from '@/domain/use_cases/use_cases'

const authPhoneVerifyUseCase = new AuthPhoneVerifyUseCase()
const authPhoneConfirmUseCase = new AuthPhoneConfirmUseCase()

const EXPIRATION_TIME = 300
const VERIFICATION_CODE_LENGTH = 6

class SignInStore {
  phoneNumber = ''
  verificationCode = ''
  confirmationResult: ConfirmationResult | null = null
  expirationTime = EXPIRATION_TIME
  verificationError: string | null = null
  loading = false
  verified = false

  private timerIntervalId: number | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get validPhoneNumber() {
    return /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(this.phoneNumber.replace(/-/g, ''))
  }

  get validVerificationCode() {
    return /^\d{6}$/.test(this.verificationCode)
  }

  get verificationCodeRequested() {
    return this.confirmationResult !== null
  }

  get timerActive() {
    return this.timerIntervalId !== null && this.expirationTime > 0 && !this.verified
  }

  get timerExpired() {
    return this.expirationTime <= 0
  }

  get valid() {
    return this.validVerificationCode && !this.timerExpired && this.verified
  }

  get errorMessage() {
    if (this.timerExpired) {
      return '인증시간이 만료됐어요'
    }
    return this.verificationError
  }

  get canRequestVerification() {
    return !this.loading && this.validPhoneNumber && !this.verificationCodeRequested
  }

  get canVerifyCode() {
    return (
      this.validVerificationCode &&
      !this.loading &&
      !this.timerExpired &&
      !this.verified &&
      this.verificationCodeRequested
    )
  }

  get expirationTimeDisplayString() {
    const seconds = this.expirationTime
    const minutes = Math.floor(seconds / 60).toString()
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${remainingSeconds}`
  }

  get expirationTimeScreenReaderString() {
    const seconds = this.expirationTime
    const minutes = Math.floor(seconds / 60).toString()
    const remainingSeconds = (seconds % 60).toString()
    return `${minutes}분 ${remainingSeconds}초 남음`
  }

  updatePhoneNumber = (phoneNumber: string) => {
    if (this.verificationCodeRequested) return
    this.phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
  }

  updateVerificationCode = (code: string) => {
    this.verificationCode = code.replace(/[^0-9]/g, '').slice(0, VERIFICATION_CODE_LENGTH)
    this.verificationError = null
  }

  handleLoading = (state: boolean) => {
    this.loading = state
  }

  requestVerification = async () => {
    if (!this.canRequestVerification) return

    this.handleLoading(true)
    this.resetVerificationState()

    try {
      const formattedPhoneNumber = '+82' + this.phoneNumber.replace(/-/g, '')
      const auth = getAuth()

      const result = await authPhoneVerifyUseCase.call({
        auth,
        phoneNumber: formattedPhoneNumber,
      })

      runInAction(() => {
        this.confirmationResult = result
      })

      this.startTimer()
    } catch (error) {
      console.error('인증번호 요청 실패:', error)
      this.verificationError = '인증번호 요청에 실패했습니다. 다시 시도해주세요.'
    } finally {
      this.handleLoading(false)
    }
  }

  verifyCode = async () => {
    if (!this.canVerifyCode) return false

    this.handleLoading(true)

    try {
      const user = await authPhoneConfirmUseCase.call({
        verificationCode: this.verificationCode,
        confirmationResult: this.confirmationResult!,
      })

      this.stopTimer()

      runInAction(() => {
        this.verified = !!user
        if (!user) this.verificationError = '인증번호를 다시 확인해주세요'
      })

      return !!user
    } catch (error) {
      console.error('인증번호 확인 실패:', error)

      runInAction(() => {
        this.verificationError = '인증번호를 다시 확인해주세요'
        this.verified = false
      })

      return false
    } finally {
      this.handleLoading(false)
    }
  }

  startTimer = () => {
    this.stopTimer()
    this.expirationTime = EXPIRATION_TIME
    this.timerIntervalId = window.setInterval(() => {
      runInAction(() => {
        this.expirationTime -= 1
        if (this.expirationTime <= 0) this.stopTimer()
      })
    }, 1000)
  }

  stopTimer = () => {
    clearInterval(this.timerIntervalId ?? undefined)
    this.timerIntervalId = null
  }

  init = () => {
    this.cleanup()
    if (this.verificationCodeRequested && !this.verified && this.expirationTime > 0) this.startTimer()
  }

  cleanup = () => {
    this.stopTimer()
  }

  reset = () => {
    this.phoneNumber = ''
    this.verificationCode = ''
    this.confirmationResult = null
    this.expirationTime = EXPIRATION_TIME
    this.verificationError = null
    this.loading = false
    this.verified = false
    this.cleanup()
  }

  resetVerificationState = () => {
    this.verificationCode = ''
    this.verificationError = null
    this.verified = false
  }
}

const store = new SignInStore()

export function useSignInViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId') ?? ''

  const goBack = () => {
    void navigate(buildRoute('HOME', {}, { vehicleId: vehicleId }))
  }

  const redirectToPreviousPage = () => {
    void navigate(-1)
  }
  return {
    ...store,
    validPhoneNumber: store.validPhoneNumber,
    validVerificationCode: store.validVerificationCode,
    verificationCodeRequested: store.verificationCodeRequested,
    timerActive: store.timerActive,
    timerExpired: store.timerExpired,
    valid: store.valid,
    errorMessage: store.errorMessage,
    canRequestVerification: store.canRequestVerification,
    canVerifyCode: store.canVerifyCode,
    expirationTimeDisplayString: store.expirationTimeDisplayString,
    expirationTimeScreenReaderString: store.expirationTimeScreenReaderString,
    goBack,
    redirectToPreviousPage,
    VERIFICATION_CODE_LENGTH,
  }
}
