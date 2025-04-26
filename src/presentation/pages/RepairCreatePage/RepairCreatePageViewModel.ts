import { atom, useAtom } from 'jotai'
import { useNavigate } from 'react-router'

import { RepairModel } from '@/domain/models/repair_model'

export type RepairType = 'accident' | 'routine' | null

const initialRepairModel = new RepairModel({})

const repairModelAtom = atom<RepairModel>(initialRepairModel)

export function useRepairCreateViewModel() {
  const [repairModel, setRepairModel] = useAtom(repairModelAtom)
  const navigate = useNavigate()

  const isFormValid = Boolean(
    repairModel.type !== '' && repairModel.price > 0 && repairModel.problem && repairModel.action
  )

  const priceDisplayString = repairModel.price.toLocaleString('ko-KR')

  const updateType = (type: RepairType) => {
    setRepairModel((prev) =>
      prev.copyWith({
        type: type as string,
      })
    )
  }

  const updatePrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    const price = numericValue === '' ? 0 : parseInt(numericValue, 10)

    setRepairModel((prev) =>
      prev.copyWith({
        price,
      })
    )
  }

  const updateProblem = (value: string) => {
    setRepairModel((prev) =>
      prev.copyWith({
        problem: value,
      })
    )
  }

  const updateAction = (value: string) => {
    setRepairModel((prev) =>
      prev.copyWith({
        action: value,
      })
    )
  }

  const submitRepair = () => {
    if (!isFormValid) return

    alert('정비사항이 저장되었습니다.')
    resetForm()

    void navigate(-1)
  }

  const resetForm = () => {
    setRepairModel(initialRepairModel)
  }

  return {
    repairModel,
    type: repairModel.type,
    price: repairModel.price.toString(),
    problem: repairModel.problem,
    action: repairModel.action,
    isFormValid,
    updateType,
    updatePrice,
    updateProblem,
    updateAction,
    submitRepair,
    resetForm,
    priceDisplayString,
  }
}
