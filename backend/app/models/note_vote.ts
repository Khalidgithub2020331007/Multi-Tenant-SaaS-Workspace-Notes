import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Note from './note.js'

export default class NoteVote extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare note_id: number

  @column()
  declare voter_user_id: number

  @column()
  declare vote_value: number // 1 = upvote, -1 = downvote

  @belongsTo(() => Note)
  declare note: BelongsTo<typeof Note>

  @belongsTo(() => User)
  declare voter: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
