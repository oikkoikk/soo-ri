interface Vehicle {
  id?: string
  registeredAt?: Date
  purchasedAt?: Date
  model?: string
}

export class VehicleModel implements Vehicle {
  readonly id: string
  readonly registeredAt: Date
  readonly purchasedAt: Date
  readonly model: string

  constructor(model: Vehicle) {
    this.id = model.id ?? ''
    this.registeredAt = new Date(model.registeredAt ?? new Date())
    this.purchasedAt = new Date(model.purchasedAt ?? new Date())
    this.model = model.model ?? ''
  }

  get registeredAtDisplayString(): string {
    return this.registeredAt.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  get purchasedAtDisplayString(): string {
    return this.purchasedAt.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  copyWith(changes: Partial<Vehicle>): VehicleModel {
    return new VehicleModel({
      ...this,
      ...changes,
      registeredAt: changes.registeredAt ? new Date(changes.registeredAt) : this.registeredAt,
      purchasedAt: changes.purchasedAt ? new Date(changes.purchasedAt) : this.purchasedAt,
    })
  }
}
