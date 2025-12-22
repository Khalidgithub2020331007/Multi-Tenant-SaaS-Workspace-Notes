// note model

import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Workspace from './workspace.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tag from './tag.js'

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare workspace_id: number

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

  @column()
  declare totalvotes: number

  @belongsTo(() => User)
  declare authorUser: BelongsTo<typeof User>

  @belongsTo(() => Workspace, { foreignKey: 'workspace_id' })
  declare workspace: BelongsTo<typeof Workspace>
  @manyToMany(() => Tag, {
    pivotTable: 'note_tags',
  })
  declare tags: ManyToMany<typeof Tag>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
