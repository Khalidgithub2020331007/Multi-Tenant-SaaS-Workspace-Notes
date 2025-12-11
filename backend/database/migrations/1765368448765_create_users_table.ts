// database/migrations/xxxx_users.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()

      table
        .string('company_hostname')
        .notNullable()
        .references('hostname')
        .inTable('companies')
        .onDelete('CASCADE')

      table.enum('role', ['owner', 'member']).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
