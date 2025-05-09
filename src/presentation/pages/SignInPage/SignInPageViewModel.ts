import { ConfirmationResult, getAuth } from 'firebase/auth'
import { makeAutoObservable } from 'mobx'

import { AuthPhoneConfirmUseCase } from '@/domain/use_cases/auth_phone_confirm_use_case'
import { AuthPhoneVerifyUseCase } from '@/domain/use_cases/auth_phone_verify_use_case'

const authPhoneVerifyUseCase = new AuthPhoneVerifyUseCase()
const authPhoneConfirmUseCase = new AuthPhoneConfirmUseCase()

const EXPIRATION_TIME = 300
const COOLDOWN_TIME = 30
const VERIFICATION_CODE_LENGTH = 6

class SignInStore {
  phoneNumber = ''
  verificationCode = ''
  confirmationResult: ConfirmationResult | null = null
  expirationTime = EXPIRATION_TIME
  cooldownTime = 0
  verificationError: string | null = null
  loading = false
  verified = false
  verificationCodeLength = VERIFICATION_CODE_LENGTH

  private timerIntervalId: number | null = null
  private cooldownIntervalId: number | null = null

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

  get cooldownActive() {
    return this.cooldownIntervalId !== null && this.cooldownTime > 0
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
    return !this.cooldownActive && !this.loading && this.validPhoneNumber
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
    this.phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
  }

  updateVerificationCode = (code: string) => {
    this.verificationCode = code.replace(/[^0-9]/g, '').slice(0, this.verificationCodeLength)
    if (this.verificationError) {
      this.verificationError = null
    }
  }

  requestVerification = async () => {
    if (!this.canRequestVerification) return

    try {
      this.loading = true

      this.verificationCode = ''
      this.verificationError = null
      this.verified = false

      const formattedPhoneNumber = '+82' + this.phoneNumber.replace(/-/g, '')

      const auth = getAuth()
      const result = await authPhoneVerifyUseCase.call({ auth: auth, phoneNumber: formattedPhoneNumber })

      this.confirmationResult = result

      this.startTimer()
      this.startCooldown()
    } catch (error) {
      console.error('인증번호 요청 실패:', error)
      this.verificationError = '인증번호 요청에 실패했습니다. 다시 시도해주세요.'
    } finally {
      this.loading = false
    }
  }

  verifyCode = async () => {
    if (!this.canVerifyCode) return false

    try {
      this.loading = true
      const user = await authPhoneConfirmUseCase.call({
        verificationCode: this.verificationCode,
        confirmationResult: this.confirmationResult!,
      })

      this.stopTimer()

      if (user) {
        this.verificationError = null
      } else {
        // TODO: user 생성
      }
      this.verified = true
      return true
    } catch (error) {
      console.error('인증번호 확인 실패:', error)
      this.verificationError = '인증번호를 다시 확인해주세요'
      this.verified = false
      return false
    } finally {
      this.loading = false
    }
  }

  decrementTimer = () => {
    if (this.expirationTime > 0) {
      this.expirationTime -= 1
    } else {
      this.stopTimer()
    }
  }

  decrementCooldown = () => {
    if (this.cooldownTime > 0) {
      this.cooldownTime -= 1
    } else {
      this.stopCooldown()
    }
  }

  startTimer = () => {
    this.stopTimer()
    this.expirationTime = EXPIRATION_TIME
    this.timerIntervalId = window.setInterval(this.decrementTimer, 1000)
  }

  stopTimer = () => {
    if (this.timerIntervalId !== null) {
      window.clearInterval(this.timerIntervalId)
      this.timerIntervalId = null
    }
  }

  startCooldown = () => {
    this.stopCooldown()
    this.cooldownTime = COOLDOWN_TIME
    this.cooldownIntervalId = window.setInterval(this.decrementCooldown, 1000)
  }

  stopCooldown = () => {
    if (this.cooldownIntervalId !== null) {
      window.clearInterval(this.cooldownIntervalId)
      this.cooldownIntervalId = null
    }
  }

  init = () => {
    this.cleanup()

    if (this.verificationCodeRequested && !this.verified && this.expirationTime > 0) {
      this.startTimer()
    }

    if (this.cooldownTime > 0 && this.cooldownIntervalId === null) {
      this.startCooldown()
    }
  }

  cleanup = () => {
    this.stopTimer()
    this.stopCooldown()
  }

  reset = () => {
    this.phoneNumber = ''
    this.verificationCode = ''
    this.confirmationResult = null
    this.expirationTime = EXPIRATION_TIME
    this.cooldownTime = 0
    this.verificationError = null
    this.loading = false
    this.verified = false
    this.verificationCodeLength = VERIFICATION_CODE_LENGTH
    this.cleanup()
  }
}

const store = new SignInStore()

export function useSignInViewModel() {
  return store
}
