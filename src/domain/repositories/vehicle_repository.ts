import { VehicleModel } from '@/domain/models/models'

export interface VehicleRepository {
  getUserVehicle(token: string): Promise<VehicleModel>
}
