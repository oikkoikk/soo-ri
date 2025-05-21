import { VehicleModel } from '@/domain/models/models'
import { VehicleRepository } from '@/domain/repositories/repositories'

import { HttpClientAdapter } from '../adapters/adapters'

interface VehicleApiResponse {
  vehicleId: string
}

export class VehicleRepositorySoori implements VehicleRepository {
  private readonly baseUrl = '/vehicles'
  constructor(private readonly httpClient: HttpClientAdapter) {}

  async getUserVehicle(token: string): Promise<VehicleModel> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.get<VehicleApiResponse>(`${this.baseUrl}/me`, config)

      return new VehicleModel({
        id: response.vehicleId,
      })
    } catch (error) {
      console.error('전동보장구 정보 조회 실패:', error)
      throw error
    }
  }
}
