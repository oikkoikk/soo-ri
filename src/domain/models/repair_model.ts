interface Repair {
  id: string
  repairedAt: Date
  price: number
  type: string
  shopLabel: string
  shopCode: string
}

export class RepairModel implements Repair {
  readonly id: string
  readonly repairedAt: Date
  readonly price: number
  readonly type: string
  readonly shopLabel: string
  readonly shopCode: string

  constructor(model: Repair) {
    this.id = model.id
    this.repairedAt = new Date(model.repairedAt)
    this.price = model.price
    this.type = model.type
    this.shopLabel = model.shopLabel
    this.shopCode = model.shopCode
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
