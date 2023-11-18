import { type Repository } from 'typeorm'

export abstract class BaseFactory<Entity> {
  constructor(protected readonly repository: Repository<Entity>) {}

  public async createMany(count: number, parameters: Array<Partial<Entity>> = []): Promise<Entity[]> {
    const promises = new Array(count)
      .fill(null)
      .map(async (_, index: number) => await this.create(parameters[index] || {}))

    return await Promise.all(promises)
  }

  public async create(props: Partial<Entity> = {}): Promise<Entity> {
    return await this.repository.save(this.repository.create({ ...this.template, ...props } as Entity))
  }

  abstract get template(): Partial<Entity>
}
