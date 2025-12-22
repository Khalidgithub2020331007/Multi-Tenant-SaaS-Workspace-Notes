import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import Note from './note.js'
export default class Workspace extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare workspace_name: string

  @column()
  declare company_hostname: string
  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>
  @hasMany(() => Note)
  declare notes: HasMany<typeof Note>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
