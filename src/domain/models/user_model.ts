export type UserRole = 'user' | 'admin' | 'repairer' | 'guardian'

interface User {
  id?: string
  firebaseUid?: string
  phoneNumber?: string
  role?: UserRole
  guardianIds?: string[]
}

export class UserModel implements User {
  readonly id: string
  readonly firebaseUid: string
  readonly phoneNumber: string
  readonly role: UserRole
  readonly guardianIds: string[]

  constructor(model: User) {
    this.id = model.id ?? ''
    this.firebaseUid = model.firebaseUid ?? ''
    this.phoneNumber = model.phoneNumber ?? ''
    this.role = model.role ?? 'user'
    this.guardianIds = model.guardianIds ?? []
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

  copyWith(changes: Partial<User>): UserModel {
    return new UserModel({
      ...this,
      ...changes,
    })
  }
}
