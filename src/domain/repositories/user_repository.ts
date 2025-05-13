import { UserModel } from '@/domain/models/models'

export interface CheckUserResponse {
  exists: boolean
  user?: UserModel
}

export interface SignUpParams {
  name: string
  model: string
  purchasedAt: string
  registeredAt: string
  recipientType: string
  vehicleId?: string
}

export interface UserRepository {
  checkUserExists(token: string): Promise<CheckUserResponse>
  signUp(token: string, userData: SignUpParams): Promise<UserModel>
  getUserRole(token: string): Promise<string>
}
