import { makeAutoObservable } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairModel } from '@/domain/models/repair_model'

export type RepairType = 'accident' | 'routine' | null
export type RepairCategory = 'tire_replacement' | 'battery_check' | 'brake_repair'

export const CATEGORY_LABELS: Record<RepairCategory, string> = {
  tire_replacement: '타이어 교체',
  battery_check: '배터리 점검',
  brake_repair: '제동장치 수리',
}

export const CATEGORY_KEYS: RepairCategory[] = ['tire_replacement', 'battery_check', 'brake_repair']

class RepairCreateStore {
  repairModel: RepairModel = new RepairModel({})

  constructor() {
    makeAutoObservable(this)
  }

  get valid(): boolean {
    return Boolean(
      this.repairModel.type !== '' &&
        this.repairModel.price >= 0 &&
        this.repairModel.problem &&
        this.repairModel.action &&
        this.repairModel.categories.length > 0
    )
  }

  getCategoryLabel = (categoryKey: RepairCategory): string => {
    return CATEGORY_LABELS[categoryKey]
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

  const addPhoto = () => {
    // TODO: 사진 추가 기능 구현
    alert('사진 추가 기능이 구현될 예정입니다.')
  }

  return {
    ...store,
    vehicleId,
    valid: store.valid,
    submitRepair,
    goBack,
    addPhoto,
  }
}
