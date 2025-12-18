// migration note tag table

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class NoteTags extends BaseSchema {
  protected tableName = 'note_tags'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.integer('note_id').unsigned()
      table.integer('tag_id').unsigned()
      table.timestamps(true, true)
      table.unique(['note_id', 'tag_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
