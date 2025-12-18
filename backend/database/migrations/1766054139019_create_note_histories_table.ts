import { BaseSchema } from '@adonisjs/lucid/schema'

export default class NoteHistoriesTable extends BaseSchema {
  protected tableName = 'note_histories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('note_id')

      table
        .enum('status_type', ['created', 'updated', 'deleted'])
        .notNullable()
        .defaultTo('created')
      table.string('note_title', 255).notNullable()
      table.text('note_content', 'longtext').notNullable()

      table.integer('author_user_id')

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
