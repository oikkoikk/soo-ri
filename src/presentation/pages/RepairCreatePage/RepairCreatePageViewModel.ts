import { makeAutoObservable } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { REPAIR_CATEGORY_LABELS, RepairCategory, RepairModel, RepairType } from '@/domain/models/repair_model'

class RepairCreateStore {
  repairModel: RepairModel = new RepairModel({})

  constructor() {
    makeAutoObservable(this)
  }

  // 날짜를 input[type="date"]에 맞는 형식으로 변환하는 메서드
  formatDateForInput = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year.toString()}-${month}-${day}`
  }

  get valid(): boolean {
    const isEtcValid = !this.hasBattery || this.repairModel.batteryVoltage.trim() !== ''
    const isBatteryValid = !this.hasEtc || this.repairModel.etcRepairPart.trim() !== ''

    return Boolean(
      this.repairModel.type !== '' &&
        this.repairModel.shopLabel.trim() !== '' &&
        this.repairModel.officer.trim() !== '' &&
        this.repairModel.problem &&
        this.repairModel.categories.length > 0 &&
        isEtcValid &&
        isBatteryValid
    )
  }

  get hasBattery(): boolean {
    return this.repairModel.categories.includes('battery')
  }

  get hasEtc(): boolean {
    return this.repairModel.categories.includes('etc')
  }

  getCategoryLabel = (categoryKey: RepairCategory): string => {
    return CATEGORY_LABELS[categoryKey]
  }

  updateRepairOfficer = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      officer: value,
    })
  }

  updateRepairShop = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      shopLabel: value,
    })
  }

  updateBatteryVoltage = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      batteryVoltage: value,
    })
  }

  updateEtcRepairPart = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      etcRepairPart: value,
    })
  }

  updateRepairDate = (date: Date) => {
    this.repairModel = this.repairModel.copyWith({
      repairedAt: date,
    })
  }

  updateType = (type: RepairType) => {
    this.repairModel = this.repairModel.copyWith({
      type: type as string,
    })
  }

  toggleCategory = (category: RepairCategory) => {
    const currentCategories = [...this.repairModel.categories]
    const categoryIndex = currentCategories.indexOf(category)

    if (categoryIndex >= 0) {
      currentCategories.splice(categoryIndex, 1)
    } else {
      currentCategories.push(category)
    }

    this.repairModel = this.repairModel.copyWith({
      categories: currentCategories,
    })
  }

  categorySelected = (category: RepairCategory): boolean => {
    return this.repairModel.categories.includes(category)
  }

  updateProblem = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      problem: value,
    })
  }

  updateAction = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      action: value,
    })
  }

  resetForm = () => {
    this.repairModel = new RepairModel({})
  }
}
const store = new RepairCreateStore()

export function useRepairCreateViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId') ?? ''

  const submitRepair = () => {
    if (!store.valid) return

    alert('정비사항이 저장되었습니다.')
    store.resetForm()
    goBack()
  }

  const goBack = () => {
    void navigate(buildRoute('REPAIRS', {}, { vehicleId: vehicleId }))
  }

  return {
    ...store,
    vehicleId,
    valid: store.valid,
    hasBattery: store.hasBattery,
    hasEtc: store.hasEtc,
    submitRepair,
    goBack,
  }
}
