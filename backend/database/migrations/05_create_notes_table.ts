import { BaseSchema } from '@adonisjs/lucid/schema'

export default class NotesTableSchema extends BaseSchema {
  protected tableName = 'notes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // workspace_name foreign key
      table
        .integer('workspace_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE')

      // author_user_id foreign key
      table
        .integer('author_user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('company_hostname').notNullable()
      table.string('title').notNullable()
      table.text('content', 'longtext').notNullable()

      table.enum('note_type', ['draft', 'public', 'private']).notNullable().defaultTo('draft')
      table.integer('upvotes').defaultTo(0)
      table.integer('downvotes').defaultTo(0)
      table.integer('totalvotes').defaultTo(0)

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
