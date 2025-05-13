import { makeAutoObservable } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairModel } from '@/domain/models/repair_model'

class RepairDetailStore {
  repairModel: RepairModel = new RepairModel({
    id: 'RP2024001',
    vehicleId: 'V001',
    memo: '파손부위 점검 후 수리 요청',
    repairedAt: new Date(2024, 3, 15),
    billingPrice: 150000,
    isAccident: false,
    repairStationLabel: '쏘리 서비스센터',
    repairStationCode: 'SSC001',
    repairCategories: ['제동장치', '타이어 | 튜브'],
    repairer: '김수리',
  })

  constructor() {
    makeAutoObservable(this)
  }

  get billingPriceDisplayString(): string {
    return this.repairModel.billingPriceDisplayString
  }
}

const store = new RepairDetailStore()

export function useRepairDetailViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId') ?? ''

  const goBack = () => {
    void navigate(buildRoute('REPAIRS', {}, { vehicleId: vehicleId }))
  }

  return {
    ...store,
    billingPriceDisplayString: store.billingPriceDisplayString,
    goBack,
  }
}
