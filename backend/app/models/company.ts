import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Workspace from './workspace.js'
import User from './user.js'
import Tag from './tag.js'

export default class Company extends BaseModel {
  public static table = 'companies'

  @column({ isPrimary: true })
  declare company_id: number

  @column()
  declare hostname: string

  @column()
  declare company_name: string

  @column()
  declare owner_name: string

  @column()
  declare owner_email: string

  @column()
  declare owner_password: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  // Relationships

  @hasMany(() => Workspace)
  declare workspaces: HasMany<typeof Workspace>

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Tag)
  declare tags: HasMany<typeof Tag>
}
