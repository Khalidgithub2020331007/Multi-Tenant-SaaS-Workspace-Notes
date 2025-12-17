// migration note table

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('workspace_id')
        .unsigned()
        .references('id')
        .inTable('workspaces')
        .onDelete('cascade')

      table
        .integer('author_user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('cascade')
      table.string('company_hostname').notNullable
      table.string('title').notNullable()
      table.text('content', 'longtext').notNullable()
      table.enum('note_type', ['draft', 'public', 'private']).notNullable().defaultTo('draft')
      table.integer('upvotes').defaultTo(0)
      table.integer('downvotes').defaultTo(0)

      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
