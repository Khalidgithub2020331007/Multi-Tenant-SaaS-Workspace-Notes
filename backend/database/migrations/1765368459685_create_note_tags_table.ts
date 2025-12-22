// migration note tag table

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class NoteTags extends BaseSchema {
  protected tableName = 'note_tags'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.integer('note_id').unsigned().references('id').inTable('notes').onDelete('CASCADE')
      table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE')
      table.timestamps(true, true)
      table.unique(['note_id', 'tag_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
