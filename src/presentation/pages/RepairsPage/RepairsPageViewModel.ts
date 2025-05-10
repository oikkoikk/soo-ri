import { makeAutoObservable } from 'mobx'
import { useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairModel, VehicleModel } from '@/domain/models/models'

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
  repairPriceSumThisMonth = 0

  constructor() {
    makeAutoObservable(this)
    this.loadSampleData()
    this.calculateTotalRepairsCount()
    this.calculateRepairPriceSumThisMonth()
  }

  get filteredRepairs() {
    return this.repairs
      .filter((repair) => {
        if (!this.searchKeyword) return true
        return repair.type.includes(this.searchKeyword) || repair.shopLabel.includes(this.searchKeyword)
      })
      .sort((a, b) => b.repairedAt.getTime() - a.repairedAt.getTime())
  }

  get totalRepairsCountDisplayString() {
    return this.totalRepairsCount.toLocaleString('ko-KR') + '회'
  }

  get repairPriceSumThisMonthDisplayString() {
    return this.repairPriceSumThisMonth.toLocaleString('ko-KR') + '원'
  }

  updateSearchKeyword = (term: string) => {
    this.searchKeyword = term
  }

  changeTab = (tabId: TabId) => {
    this.activeTab = tabId
  }

  loadSampleData = () => {
    // 샘플 데이터
    const sampleRepairs = [
      new RepairModel({
        id: '1',
        repairedAt: new Date('2025-04-22'),
        price: 42000,
        type: '단순 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '2',
        repairedAt: new Date('2025-04-12'),
        price: 83000,
        type: '사고 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '3',
        repairedAt: new Date('2023-04-18'),
        price: 62000,
        type: '사고 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '4',
        repairedAt: new Date('2023-01-12'),
        price: 12000,
        type: '단순 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '5',
        repairedAt: new Date('2022-07-25'),
        price: 15000,
        type: '단순 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
      }),
      new RepairModel({
        id: '6',
        repairedAt: new Date('2022-05-01'),
        price: 47000,
        type: '단순 수리',
        shopLabel: '성동장애인복지관',
        shopCode: 'SD001',
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

  calculateRepairPriceSumThisMonth = () => {
    const currentDate = new Date()
    this.repairPriceSumThisMonth = this.repairs.reduce((sum, repair) => {
      if (
        repair.repairedAt.getFullYear() === currentDate.getFullYear() &&
        repair.repairedAt.getMonth() === currentDate.getMonth()
      ) {
        return sum + repair.price
      }
      return sum
    }, 0)
  }
}

const store = new RepairsStore()

export function useRepairsViewModel() {
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId') ?? ''

  const buildRouteForRepairCreatePage = () => {
    return buildRoute('REPAIR_CREATE', {}, { vehicleId: vehicleId })
  }

  const buildRouteForRepairDetailPage = (repairId: string) => {
    return buildRoute('REPAIR_DETAIL', { repairId: repairId }, { vehicleId: vehicleId })
  }

  return {
    ...store,
    vehicleId,
    filteredRepairs: store.filteredRepairs,
    totalRepairsCountDisplayString: store.totalRepairsCountDisplayString,
    repairPriceSumThisMonthDisplayString: store.repairPriceSumThisMonthDisplayString,
    tabItems,
    buildRouteForRepairCreatePage,
    buildRouteForRepairDetailPage,
  }
}
