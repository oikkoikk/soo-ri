import { makeAutoObservable } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairCategory, RepairModel } from '@/domain/models/models'

class RepairCreateStore {
  repairModel: RepairModel = new RepairModel({})

  constructor() {
    makeAutoObservable(this)
  }

  dateInputFormatString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year.toString()}-${month}-${day}`
  }

  billingPriceInputFormatString = (billingPrice: number): string => {
    return billingPrice.toLocaleString('ko-KR')
  }

  parseBillingPrice = (value: string): number => {
    return Number(value.replace(/,/g, ''))
  }

  get valid(): boolean {
    const batteryFieldValid = !this.hasBattery || this.repairModel.batteryVoltage.trim() !== ''
    const etcFieldValid = !this.hasEtc || this.repairModel.etcRepairPart.trim() !== ''

    return Boolean(
      this.repairModel.type !== '' &&
        this.repairModel.repairStationLabel.trim() !== '' &&
        this.repairModel.repairer.trim() !== '' &&
        this.repairModel.billingPrice >= 0 &&
        this.repairModel.repairCategories.length > 0 &&
        batteryFieldValid &&
        etcFieldValid
    )
  }

  get hasBattery(): boolean {
    return this.repairModel.repairCategories.includes('battery')
  }

  get hasEtc(): boolean {
    return this.repairModel.repairCategories.includes('etc')
  }

  updateIsAccident = (isAccident: boolean) => {
    this.repairModel = this.repairModel.copyWith({
      isAccident: isAccident,
    })
  }

  updateRepairDate = (value: string) => {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      this.repairModel = this.repairModel.copyWith({
        repairedAt: new Date(),
      })
      return
    }
    this.repairModel = this.repairModel.copyWith({
      repairedAt: date,
    })
  }

  updateRepairer = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      repairer: value,
    })
  }

  updateBillingPrice = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '')
    const numericValue = cleanValue ? parseInt(cleanValue, 10) : 0

    this.repairModel = this.repairModel.copyWith({
      billingPrice: numericValue,
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

  updateMemo = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      memo: value,
    })
  }

  toggleCategory = (category: RepairCategory) => {
    const currentRepairCategories = [...this.repairModel.repairCategories]
    const categoryIndex = currentRepairCategories.indexOf(category)

    if (categoryIndex >= 0) {
      currentRepairCategories.splice(categoryIndex, 1)
    } else {
      currentRepairCategories.push(category)
    }

    this.repairModel = this.repairModel.copyWith({
      repairCategories: currentRepairCategories,
    })
  }

  categorySelected = (category: RepairCategory): boolean => {
    return this.repairModel.repairCategories.includes(category)
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
