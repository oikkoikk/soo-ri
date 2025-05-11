export type UserRole = 'user' | 'admin' | 'repairer' | 'guardian'

export type RecipientType = 'general' | 'disabled' | 'lowIncome'

interface User {
  id?: string
  firebaseUid?: string
  phoneNumber?: string
  role?: UserRole
  guardianIds?: string[]
  name?: string
  recipientType?: RecipientType
}

export class UserModel implements User {
  readonly id: string
  readonly firebaseUid: string
  readonly phoneNumber: string
  readonly role: UserRole
  readonly guardianIds: string[]
  readonly name: string
  readonly recipientType: RecipientType

  constructor(model: User) {
    this.id = model.id ?? ''
    this.firebaseUid = model.firebaseUid ?? ''
    this.phoneNumber = model.phoneNumber ?? ''
    this.role = model.role ?? 'user'
    this.guardianIds = model.guardianIds ?? []
    this.name = model.name ?? ''
    this.recipientType = model.recipientType ?? 'general'
  }

  get isAdmin(): boolean {
    return this.role === 'admin'
  }

  get isRepairer(): boolean {
    return this.role === 'repairer'
  }

  get isGuardian(): boolean {
    return this.role === 'guardian'
  }

  get hasGuardians(): boolean {
    return this.guardianIds.length > 0
  }

  get isDisabled(): boolean {
    return this.recipientType === 'disabled'
  }

  get isLowIncome(): boolean {
    return this.recipientType === 'lowIncome'
  }

  copyWith(changes: Partial<User>): UserModel {
    return new UserModel({
      ...this,
      ...changes,
    })
  }
}
