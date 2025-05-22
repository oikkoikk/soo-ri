import { SelfCheckModel } from '@/domain/models/models'

export interface SelfCheckRepository {
  createSelfCheck(vehicleId: string, selfCheck: SelfCheckModel, token: string): Promise<SelfCheckModel>
}
