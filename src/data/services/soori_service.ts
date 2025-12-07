import { AxiosHttpClientAdapter } from '../adapters/adapters'
import {
  RepairRepositorySoori,
  RepairStationRepositorySoori,
  SelfCheckRepositorySoori,
  UserRepositorySoori,
  VehicleRepositorySoori,
  WelfareReportRepositorySoori,
} from '../repositories/repositories'

// Fallback to correct Cloud Functions URL if env var is missing or incorrect
const getApiUrl = (envUrl: string | undefined): string => {
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (envUrl && envUrl.includes('cloudfunctions.net')) {
    return envUrl
  }
  return 'https://asia-northeast3-soo-ri.cloudfunctions.net/api'
}

const SOORI_BASE_URL = getApiUrl(import.meta.env.VITE_SOORI_BASE_URL as string | undefined)
const SECOND = 1000

export const httpClient = new AxiosHttpClientAdapter(SOORI_BASE_URL, {
  timeout: 10 * SECOND,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const userRepositorySoori = new UserRepositorySoori(httpClient)
export const repairStationRepositorySoori = new RepairStationRepositorySoori(httpClient)
export const repairRepositorySoori = new RepairRepositorySoori(httpClient)
export const vehicleRepositorySoori = new VehicleRepositorySoori(httpClient)
export const selfCheckRepositorySoori = new SelfCheckRepositorySoori(httpClient)
export const welfareReportRepositorySoori = new WelfareReportRepositorySoori()
