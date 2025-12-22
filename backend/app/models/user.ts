import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import Company from './company.js'
import Note from './note.js'
import NoteHistory from './note_history.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tag from './tag.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ columnName: 'password' })
  declare password: string

  @column()
  declare company_hostname: string

  @column()
  declare role: 'owner' | 'member'

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  // Relationships

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  @hasMany(() => Note)
  declare notes: HasMany<typeof Note>
  @hasMany(() => NoteHistory)
  declare noteHistory: HasMany<typeof NoteHistory>
  @hasMany(() => Tag)
  declare tags: HasMany<typeof Tag>
}
