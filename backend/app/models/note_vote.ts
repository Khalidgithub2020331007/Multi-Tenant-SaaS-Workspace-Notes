import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Note from './note.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class NoteVote extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare note_id: number

  @column()
  declare voter_user_id: number

  @column()
  declare vote_value: 1 | -1

  @belongsTo(() => Note)
  declare note: BelongsTo<typeof Note>

  @belongsTo(() => User)
  declare voter: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
