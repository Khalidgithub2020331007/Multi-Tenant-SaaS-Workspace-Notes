import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ columnName: 'password' })
  declare password_hash: string

  @column()
  declare company_hostname: string

  @column()
  declare role: 'owner' | 'member'

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  // Relationships

  // @belongsTo(() => Company, {
  //   foreignKey: 'company_hostname',
  //   localKey: 'hostname',
  // })
  // public company: BelongsTo<typeof Company>

  // @hasMany(() => Workspace, {
  //   foreignKey: 'owner_user_id',
  // })
  // public ownedWorkspaces: HasMany<typeof Workspace>

  // @hasMany(() => Note, {
  //   foreignKey: 'author_user_id',
  // })
  // public notes: HasMany<typeof Note>
}
