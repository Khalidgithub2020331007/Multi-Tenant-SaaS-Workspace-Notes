import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Note from './note.js'

export default class NoteHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare note_id: number

  @column()
  declare status_type: 'created' | 'updated' | 'deleted'

  @column()
  declare note_title: string

  @column()
  declare note_content: string
  @column()
  declare note_type: 'draft' | 'public' | 'private'
  @column()
  declare author_user_id: number

  @belongsTo(() => User, {
    foreignKey: 'author_user_id',
  })
  declare authorUser: BelongsTo<typeof User>
  @belongsTo(() => Note)
  declare note: BelongsTo<typeof Note>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
