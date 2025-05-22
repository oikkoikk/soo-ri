interface SelfCheck {
  id?: string
  // 모터 관련
  motorNoise?: boolean
  abnormalSpeed?: boolean
  // 배터리 관련
  batteryBlinking?: boolean
  chargingNotStart?: boolean
  batteryDischargeFast?: boolean
  incompleteCharging?: boolean
  // 브레이크 관련
  breakDelay?: boolean
  breakPadIssue?: boolean
  // 타이어 관련
  tubePunctureFrequent?: boolean
  tireWearFrequent?: boolean
  // 시트 관련
  seatUnstable?: boolean
  seatCoverIssue?: boolean
  // 기타 부품
  footRestLoose?: boolean
  antislipWorn?: boolean
  // 프레임
  frameNoise?: boolean
  frameCrack?: boolean

  createdAt?: Date
  updatedAt?: Date
}

export class SelfCheckModel implements SelfCheck {
  readonly id: string
  readonly motorNoise: boolean
  readonly abnormalSpeed: boolean
  readonly batteryBlinking: boolean
  readonly chargingNotStart: boolean
  readonly batteryDischargeFast: boolean
  readonly incompleteCharging: boolean
  readonly breakDelay: boolean
  readonly breakPadIssue: boolean
  readonly tubePunctureFrequent: boolean
  readonly tireWearFrequent: boolean
  readonly seatUnstable: boolean
  readonly seatCoverIssue: boolean
  readonly footRestLoose: boolean
  readonly antislipWorn: boolean
  readonly frameNoise: boolean
  readonly frameCrack: boolean
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(model: SelfCheck) {
    this.id = model.id ?? ''
    this.motorNoise = model.motorNoise ?? false
    this.abnormalSpeed = model.abnormalSpeed ?? false
    this.batteryBlinking = model.batteryBlinking ?? false
    this.chargingNotStart = model.chargingNotStart ?? false
    this.batteryDischargeFast = model.batteryDischargeFast ?? false
    this.incompleteCharging = model.incompleteCharging ?? false
    this.breakDelay = model.breakDelay ?? false
    this.breakPadIssue = model.breakPadIssue ?? false
    this.tubePunctureFrequent = model.tubePunctureFrequent ?? false
    this.tireWearFrequent = model.tireWearFrequent ?? false
    this.seatUnstable = model.seatUnstable ?? false
    this.seatCoverIssue = model.seatCoverIssue ?? false
    this.footRestLoose = model.footRestLoose ?? false
    this.antislipWorn = model.antislipWorn ?? false
    this.frameNoise = model.frameNoise ?? false
    this.frameCrack = model.frameCrack ?? false
    this.createdAt = new Date(model.createdAt ?? new Date())
    this.updatedAt = new Date(model.updatedAt ?? new Date())
  }

  copyWith(changes: Partial<SelfCheck>): SelfCheckModel {
    return new SelfCheckModel({
      ...this,
      ...changes,
      createdAt: changes.createdAt ? new Date(changes.createdAt) : this.createdAt,
      updatedAt: changes.updatedAt ? new Date(changes.updatedAt) : this.updatedAt,
    })
  }
}
