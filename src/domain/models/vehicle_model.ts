interface Vehicle {
  id?: string
  model?: string
  purchasedAt?: Date
  registeredAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export class VehicleModel implements Vehicle {
  readonly id: string
  readonly model: string
  readonly purchasedAt: Date
  readonly registeredAt: Date
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(model: Vehicle) {
    this.id = model.id ?? ''
    this.model = model.model ?? ''
    this.purchasedAt = new Date(model.purchasedAt ?? new Date())
    this.registeredAt = new Date(model.registeredAt ?? new Date())
    this.createdAt = new Date(model.createdAt ?? new Date())
    this.updatedAt = new Date(model.updatedAt ?? new Date())
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
      purchasedAt: changes.purchasedAt ? new Date(changes.purchasedAt) : this.purchasedAt,
      registeredAt: changes.registeredAt ? new Date(changes.registeredAt) : this.registeredAt,
      createdAt: changes.createdAt ? new Date(changes.createdAt) : this.createdAt,
      updatedAt: changes.updatedAt ? new Date(changes.updatedAt) : this.updatedAt,
    })
  }
}
