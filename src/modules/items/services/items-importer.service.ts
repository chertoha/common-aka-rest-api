import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { XlsxDocument } from 'src/modules/common/services/xlsx-parser.service'
import { ItemEntity } from '../entities/item.entity'
import { ItemTranslationEntity } from '../entities/item-translation.entity'
import { type LanguageEnum } from 'src/modules/common/enums/language.enum'
import { PropertyEntity } from '../entities/property.entity'
import { PropertyTranslationEntity } from '../entities/property-translation.entity'
import { type ItemImageDto } from '../dto/item-image.dto'
import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import { type Nullable } from 'src/modules/common/types/nullable.type'
import { slugify } from 'src/modules/common/utils/slugify.utils'

export interface ImportItemsPayload {
  file: Nullable<Express.Multer.File>
}

type ImportedPropertyEntity = Partial<PropertyEntity> & { rowIndex: number }

@Injectable()
export class ItemsImporter {
  constructor(
    @InjectRepository(ItemEntity)
    protected readonly itemRepository: Repository<ItemEntity>,
    @InjectRepository(ItemTranslationEntity)
    protected readonly itemTranslationRepository: Repository<ItemTranslationEntity>,
    @InjectRepository(PropertyEntity)
    protected readonly propertyRepository: Repository<PropertyEntity>,
    @InjectRepository(PropertyTranslationEntity)
    protected readonly propertyTranslationRepository: Repository<PropertyTranslationEntity>,
    @InjectRepository(BrandEntity)
    protected readonly brandRepository: Repository<BrandEntity>
  ) {}

  protected readonly logger = new Logger(ItemsImporter.name)

  public async import({ file }: ImportItemsPayload): Promise<void> {
    const document = await this.loadDocument(file)

    const entities = await this.loadItems(document)

    await this.itemRepository.manager.transaction(async (em) => {
      const itemRepository = em.getRepository(ItemEntity)
      const propertyRepository = em.getRepository(PropertyEntity)

      for (const { properties, ...itemEntity } of entities) {
        const item = await itemRepository.save(itemEntity)

        for (const { childrenProperties, ...propertyEntity } of properties) {
          const property = await propertyRepository.save({ ...propertyEntity, itemId: item.id })

          for (const childrenProperty of childrenProperties) {
            await propertyRepository.save({ ...childrenProperty, parentId: property.id })
          }
        }
      }
    })
  }

  protected async loadDocument(file: Nullable<Express.Multer.File>): Promise<XlsxDocument> {
    if (!file) {
      throw new BadRequestException('Xlsx file was not provided')
    }
    return await XlsxDocument.parse(file.buffer).catch((e) => {
      this.logger.error(e)
      throw new BadRequestException('Error during document parsing')
    })
  }

  protected async loadItems(document: XlsxDocument): Promise<ItemEntity[]> {
    const itemsByName: Record<string, ItemEntity> = {}
    const properties = this.loadProperties(document)

    const brands: Record<string, BrandEntity> = {}

    let ownIndex = 1

    for (const row of document.rows('items')) {
      if (!row.length) {
        ownIndex++
        continue
      }

      const [_, brand, purchaseName, publicName, title, shortTitle, description, shortDescription, language] = row

      brands[brand] ||= await this.brandRepository.findOne({ where: { name: brand } })

      if (!brands[brand]) {
        throw new NotFoundException(`Brand ${brand} was not found`)
      }

      itemsByName[purchaseName] ||= this.itemRepository.create({
        purchaseName,
        publicName,
        brandId: brands[brand].id,
        images: { preview: null, gallery: [], drawings: [] } as ItemImageDto
      })
      itemsByName[purchaseName].translations ||= []

      itemsByName[purchaseName].translations.push(
        this.itemTranslationRepository.create({
          title,
          titleSlug: slugify(title, language as LanguageEnum),
          shortTitle,
          shortDescription,
          description,
          language: language as LanguageEnum
        })
      )

      itemsByName[purchaseName].properties = properties
        .filter((property) => property.rowIndex === ownIndex)
        .map(({ rowIndex: _, ...property }) => this.propertyRepository.create(property))
    }

    return Object.values(itemsByName)
  }

  protected loadProperties(document: XlsxDocument): ImportedPropertyEntity[] {
    const properties: Record<string, ImportedPropertyEntity> = {}
    const childrenProperties = this.loadChildrenProperties(document)

    let ownIndex = 1
    for (const row of document.rows('item_properties')) {
      if (!row.length) {
        ownIndex++
        continue
      }

      const [_, parentIndex, title, value, order, language] = row
      properties[ownIndex] ||= { value, order: Number.parseInt(order), rowIndex: Number.parseInt(parentIndex) }
      properties[ownIndex].translations ||= []
      properties[ownIndex].translations.push(
        this.propertyTranslationRepository.create({ title, language: language as LanguageEnum })
      )
      properties[ownIndex].childrenProperties ||= childrenProperties
        .filter((property) => property.rowIndex === ownIndex)
        .map(({ rowIndex: _, ...property }) => this.propertyRepository.create(property))
    }

    return Object.values(properties)
  }

  protected loadChildrenProperties(document: XlsxDocument): ImportedPropertyEntity[] {
    const properties: Record<string, ImportedPropertyEntity> = {}

    let ownIndex = 1
    for (const row of document.rows('child_properties')) {
      if (!row.length) {
        ownIndex++
        continue
      }

      const [_, parentIndex, title, value, order, language] = row
      properties[ownIndex] ||= { value, order: Number.parseInt(order), rowIndex: Number.parseInt(parentIndex) }
      properties[ownIndex].translations ||= []
      properties[ownIndex].translations.push(
        this.propertyTranslationRepository.create({ title, language: language as LanguageEnum })
      )
    }

    return Object.values(properties)
  }
}
