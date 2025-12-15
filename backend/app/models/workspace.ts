import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
export default class Workspace extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare workspace_name: string

  @column()
  declare company_hostname: string
  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
