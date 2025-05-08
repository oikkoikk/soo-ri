export type RepairType = 'accident' | 'routine' | null
export type RepairCategory =
  | 'drive_unit'
  | 'electronic_control'
  | 'brake'
  | 'seat'
  | 'footrest'
  | 'frame'
  | 'tire_tube'
  | 'battery'
  | 'etc'

export const REPAIR_CATEGORY_LABELS: Record<RepairCategory, string> = {
  drive_unit: '구동장치',
  electronic_control: '전자제어',
  brake: '제동장치',
  seat: '시트',
  footrest: '발걸이',
  frame: '프레임',
  tire_tube: '타이어 | 튜브',
  battery: '배터리',
  etc: '기타',
}
export const REPAIR_CATEGORY_KEYS: RepairCategory[] = Object.keys(REPAIR_CATEGORY_LABELS) as RepairCategory[]

interface Repair {
  id?: string
  repairedAt?: Date
  price?: number
  type?: string
  shopLabel?: string
  shopCode?: string
  problem?: string
  action?: string
  categories?: string[]
  officer?: string
  batteryVoltage?: string
  etcRepairPart?: string
}

export class RepairModel implements Repair {
  readonly id: string
  readonly repairedAt: Date
  readonly price: number
  readonly type: string
  readonly shopLabel: string
  readonly shopCode: string
  readonly problem: string
  readonly action: string
  readonly categories: string[]
  readonly officer: string
  readonly batteryVoltage: string
  readonly etcRepairPart: string

  constructor(model: Repair) {
    this.id = model.id ?? ''
    this.repairedAt = new Date(model.repairedAt ?? new Date())
    this.price = model.price ?? 0
    this.type = model.type ?? ''
    this.shopLabel = model.shopLabel ?? ''
    this.shopCode = model.shopCode ?? ''
    this.problem = model.problem ?? ''
    this.action = model.action ?? ''
    this.categories = model.categories ?? []
    this.officer = model.officer ?? ''
    this.batteryVoltage = model.batteryVoltage ?? ''
    this.etcRepairPart = model.etcRepairPart ?? ''
  }

  get repairedAtDisplayString(): string {
    return this.repairedAt.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  get priceDisplayString(): string {
    return this.price.toLocaleString('ko-KR') + '원'
  }

  copyWith(changes: Partial<Repair>): RepairModel {
    return new RepairModel({
      ...this,
      ...changes,
      repairedAt: changes.repairedAt ? new Date(changes.repairedAt) : this.repairedAt,
    })
  }
}
