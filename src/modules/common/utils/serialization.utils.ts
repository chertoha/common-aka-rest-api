import { type ClassConstructor, plainToInstance } from 'class-transformer'

export function mapManyToDto<Dto, T>(dtoClass: ClassConstructor<Dto>, objects: T[]): Dto[] {
  return plainToInstance(dtoClass, objects, { strategy: 'excludeAll' })
}

export function mapOneToDto<Dto, T>(dtoClass: ClassConstructor<Dto>, object: T): Dto {
  return plainToInstance(dtoClass, object, { strategy: 'excludeAll' })
}
