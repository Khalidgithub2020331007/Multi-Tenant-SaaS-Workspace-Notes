import { BaseSchema } from '@adonisjs/lucid/schema'

export default class NoteVotesTableSchema extends BaseSchema {
  protected tableName = 'note_votes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('note_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('notes')
        .onDelete('CASCADE')
      table
        .integer('voter_user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('vote_value').notNullable() // 1 or -1
      table.timestamps(true)

      table.unique(['note_id', 'voter_user_id']) // same user can vote once
    })
  }

  public async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
