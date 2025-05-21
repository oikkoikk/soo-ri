import { RepairModel, RepairCategory } from '@/domain/models/models'
import { RepairRepository } from '@/domain/repositories/repositories'

import { HttpClientAdapter } from '../adapters/adapters'

interface RepairApiItem {
  id: string
  vehicleId: string
  repairedAt: string
  billingPrice: number
  isAccident: boolean
  repairStationCode: string
  repairStationLabel: string
  repairer: string
  repairCategories: RepairCategory[]
  batteryVoltage?: string
  etcRepairParts: string
  memo: string
  createdAt?: string
  updatedAt?: string
}

interface RepairApiResponse {
  repairs: RepairApiItem[]
}

export class RepairRepositorySoori implements RepairRepository {
  constructor(private readonly httpClient: HttpClientAdapter) {}

  async getRepairsByVehicleId(token: string, vehicleId: string): Promise<RepairModel[]> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.get<RepairApiResponse>(`/vehicles/${vehicleId}/repairs`, config)
      return response.repairs.map(
        (repair) =>
          new RepairModel({
            id: repair.id,
            vehicleId: repair.vehicleId,
            billingPrice: repair.billingPrice,
            repairStationLabel: repair.repairStationLabel,
            repairStationCode: repair.repairStationCode,
            repairCategories: repair.repairCategories,
            repairer: repair.repairer,
            batteryVoltage: repair.batteryVoltage,
            etcRepairParts: repair.etcRepairParts,
            memo: repair.memo,
            isAccident: repair.isAccident,
            repairedAt: new Date(repair.repairedAt),
            createdAt: repair.createdAt ? new Date(repair.createdAt) : new Date(),
            updatedAt: repair.updatedAt ? new Date(repair.updatedAt) : new Date(),
          })
      )
    } catch (error) {
      console.error('전동보장구 수리 내역 조회 실패:', error)
      throw error
    }
  }
}
