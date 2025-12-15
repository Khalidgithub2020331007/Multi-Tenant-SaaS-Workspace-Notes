import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Tag extends BaseModel {
  public static table = 'tags'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tag_name: string

  @column()
  declare company_owner_email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
