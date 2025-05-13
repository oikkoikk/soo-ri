import { makeAutoObservable } from 'mobx'
import { useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairModel, VehicleModel } from '@/domain/models/models'
import { useUserRole } from '@/presentation/hooks/hooks'

export enum TabId {
  REPAIRS = 'repairs',
  VEHICLE = 'vehicle',
}

interface TabItem {
  id: TabId
  label: string
}

const tabItems: TabItem[] = [
  { id: TabId.REPAIRS, label: '정비 이력' },
  { id: TabId.VEHICLE, label: '전동보장구 정보' },
]

class RepairsStore {
  repairs: RepairModel[] = []
  vehicle: VehicleModel = new VehicleModel({})
  searchKeyword = ''
  activeTab: TabId = TabId.REPAIRS
  totalRepairsCount = 0
  repairBillingPriceSumThisMonth = 0
  fabExpended = false

  constructor() {
    makeAutoObservable(this)
    this.loadSampleData()
    this.calculateTotalRepairsCount()
    this.calculateRepairBillingPriceSumThisMonth()
  }

  get filteredRepairs() {
    return this.repairs
      .filter((repair) => {
        if (!this.searchKeyword) return true
        return repair.type.includes(this.searchKeyword) || repair.repairStationLabel.includes(this.searchKeyword)
      })
      .sort((a, b) => b.repairedAt.getTime() - a.repairedAt.getTime())
  }

  get totalRepairsCountDisplayString() {
    return this.totalRepairsCount.toLocaleString('ko-KR') + '회'
  }

  get repairBillingPriceSumThisMonthDisplayString() {
    return this.repairBillingPriceSumThisMonth.toLocaleString('ko-KR') + '원'
  }

  updateSearchKeyword = (term: string) => {
    this.searchKeyword = term
  }

  changeTab = (tabId: TabId) => {
    this.activeTab = tabId
  }

  toggleFab = () => {
    this.fabExpended = !this.fabExpended
  }

  loadSampleData = () => {
    // 샘플 데이터
    const sampleRepairs = [
      new RepairModel({
        id: '1',
        repairedAt: new Date('2025-04-22'),
        billingPrice: 42000,
        isAccident: false,
        repairStationLabel: '성동장애인복지관',
        repairStationCode: 'SD001',
        repairCategories: ['제동장치'],
        repairer: '박정비',
      }),
      new RepairModel({
        id: '2',
        repairedAt: new Date('2025-04-12'),
        billingPrice: 83000,
        isAccident: true,
        repairStationLabel: '성동장애인복지관',
        repairStationCode: 'SD001',
        repairCategories: ['타이어 | 튜브', '전자제어'],
        repairer: '김수리',
      }),
      new RepairModel({
        id: '3',
        repairedAt: new Date('2023-04-18'),
        billingPrice: 62000,
        isAccident: true,
        repairStationLabel: '성동장애인복지관',
        repairStationCode: 'SD001',
        repairCategories: ['시트', '프레임'],
        repairer: '이정비',
      }),
      new RepairModel({
        id: '4',
        repairedAt: new Date('2023-01-12'),
        billingPrice: 12000,
        isAccident: false,
        repairStationLabel: '성동장애인복지관',
        repairStationCode: 'SD001',
        repairCategories: ['구동장치'],
        repairer: '박정비',
      }),
      new RepairModel({
        id: '5',
        repairedAt: new Date('2022-07-25'),
        billingPrice: 15000,
        isAccident: false,
        repairStationLabel: '성동장애인복지관',
        repairStationCode: 'SD001',
        repairCategories: ['배터리'],
        repairer: '김수리',
        batteryVoltage: '12V',
      }),
      new RepairModel({
        id: '6',
        repairedAt: new Date('2022-05-01'),
        billingPrice: 47000,
        isAccident: false,
        repairStationLabel: '성동장애인복지관',
        repairStationCode: 'SD001',
        repairCategories: ['발걸이', '전자제어'],
        repairer: '이정비',
      }),
    ]

    const sampleVehicle = new VehicleModel({
      id: 'V001',
      registeredAt: new Date('2025-03-15'),
      purchasedAt: new Date('2024-02-04'),
      model: 'PM2024007',
    })

    this.repairs = sampleRepairs
    this.vehicle = sampleVehicle
  }

  calculateTotalRepairsCount = () => {
    this.totalRepairsCount = this.repairs.length
  }

  calculateRepairBillingPriceSumThisMonth = () => {
    const currentDate = new Date()
    this.repairBillingPriceSumThisMonth = this.repairs.reduce((sum, repair) => {
      if (
        repair.repairedAt.getFullYear() === currentDate.getFullYear() &&
        repair.repairedAt.getMonth() === currentDate.getMonth()
      ) {
        return sum + repair.billingPrice
      }
      return sum
    }, 0)
  }

  reset = () => {
    this.searchKeyword = ''
    this.activeTab = TabId.REPAIRS
    this.fabExpended = false
  }
}

const store = new RepairsStore()

export function useRepairsViewModel() {
  const [searchParams] = useSearchParams()
  const { isAdmin, isRepairer, isUser, isGuardian } = useUserRole()
  const vehicleId = searchParams.get('vehicleId') ?? ''

  const buildRouteForRepairCreatePage = () => {
    return buildRoute('REPAIR_CREATE', {}, { vehicleId: vehicleId })
  }

  const buildRouteForRepairDetailPage = (repairId: string) => {
    return buildRoute('REPAIR_DETAIL', { repairId: repairId }, { vehicleId: vehicleId })
  }

  const buildRouteForRepairStationsPage = () => {
    return buildRoute('REPAIR_STATIONS', {}, { vehicleId: vehicleId })
  }

  const buildRouteForVehicleTestPage = () => {
    return buildRoute('VEHICLE_TEST', {}, { vehicleId: vehicleId })
  }

  const shouldShowCTA = isAdmin || isRepairer
  const shouldShowFAB = isUser || isGuardian

  return {
    ...store,
    vehicleId,
    filteredRepairs: store.filteredRepairs,
    totalRepairsCountDisplayString: store.totalRepairsCountDisplayString,
    repairBillingPriceSumThisMonthDisplayString: store.repairBillingPriceSumThisMonthDisplayString,
    tabItems,
    buildRouteForRepairCreatePage,
    buildRouteForRepairDetailPage,
    buildRouteForRepairStationsPage,
    buildRouteForVehicleTestPage,
    isUser,
    shouldShowCTA,
    shouldShowFAB,
  }
}
