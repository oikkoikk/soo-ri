import { RepairModel } from '@/domain/models/models'

export interface RepairRepository {
  getRepairsByVehicleId(token: string, vehicleId: string): Promise<RepairModel[]>
}
