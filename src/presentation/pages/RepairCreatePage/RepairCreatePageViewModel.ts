import { makeAutoObservable } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairModel } from '@/domain/models/repair_model'

export type RepairType = 'accident' | 'routine' | null

class RepairCreateStore {
  repairModel: RepairModel = new RepairModel({})

  constructor() {
    makeAutoObservable(this)
  }

  get priceDisplayString(): string {
    return this.repairModel.price.toLocaleString('ko-KR')
  }

  get isFormValid(): boolean {
    return Boolean(
      this.repairModel.type !== '' && this.repairModel.price > 0 && this.repairModel.problem && this.repairModel.action
    )
  }

  updateType = (type: RepairType) => {
    this.repairModel = this.repairModel.copyWith({
      type: type as string,
    })
  }

  updatePrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    const price = numericValue === '' ? 0 : parseInt(numericValue, 10)

    this.repairModel = this.repairModel.copyWith({
      price,
    })
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
    if (!store.isFormValid) return

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
    submitRepair,
    goBack,
  }
}
