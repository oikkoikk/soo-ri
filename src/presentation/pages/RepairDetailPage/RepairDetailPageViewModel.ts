import { makeAutoObservable } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairModel } from '@/domain/models/repair_model'

class RepairDetailStore {
  repairModel: RepairModel = new RepairModel({
    id: 'RP2024001',
    problem: '파손부위 점검 후 수리 요청',
    action: '브레이크 및 타이어 휠 파손 확인 후 교체 조치',
    repairedAt: new Date(2024, 3, 15),
    price: 150000,
    type: '정기점검',
    shopLabel: '쏘리 서비스센터',
    shopCode: 'SSC001',
  })

  constructor() {
    makeAutoObservable(this)
  }

  get priceDisplayString(): string {
    return this.repairModel.price.toLocaleString('ko-KR') + '원'
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
    priceDisplayString: store.priceDisplayString,
    goBack,
  }
}
