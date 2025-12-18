// note model

import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Workspace from './workspace.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare workspace_name: string

  @column()
  declare author_user_id: number
  @column()
  declare title: string
  @column()
  declare content: string
  @column()
  declare note_type: 'draft' | 'public' | 'private'
  @column()
  declare company_hostname: string

  @column()
  declare upvotes: number
  @column()
  declare downvotes: number

  @belongsTo(() => User, { foreignKey: 'author_user_id' })
  declare authorUser: BelongsTo<typeof User>

  @belongsTo(() => Workspace, { foreignKey: 'workspace_name' })
  declare workspace: BelongsTo<typeof Workspace>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
