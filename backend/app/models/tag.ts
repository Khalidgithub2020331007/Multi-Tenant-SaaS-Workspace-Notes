import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Note from './note.js'

export default class Tag extends BaseModel {
  public static table = 'tags'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tag_name: string

  @column()
  declare company_hostname: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Note, {
    pivotTable: 'note_tags',
  })
  declare notes: ManyToMany<typeof Note>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
