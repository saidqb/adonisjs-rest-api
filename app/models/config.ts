import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'

export default class Config extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare key: string

  @column()
  declare value: string
}
