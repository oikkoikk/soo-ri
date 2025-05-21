import { RepairModel } from '@/domain/models/models'
import { RepairRepository } from '@/domain/repositories/repositories'

import { HttpClientAdapter } from '../adapters/adapters'

export class RepairRepositorySoori implements RepairRepository {
  constructor(private readonly httpClient: HttpClientAdapter) {}

  async getRepairsByVehicleId(token: string, vehicleId: string): Promise<RepairModel[]> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.get<{ repairs: RepairModel[] }>(`/vehicles/${vehicleId}/repairs`, config)
      return response.repairs.map((repair) => new RepairModel(repair))
    } catch (error) {
      console.error('전동보장구 수리 내역 조회 실패:', error)
      throw error
    }
  }
}
