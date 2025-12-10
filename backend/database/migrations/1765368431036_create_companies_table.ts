// database/migrations/xxxx_companies.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('hostname').primary() // PK
      table.string('company_name').notNullable()
      table.string('owner_name').notNullable()
      table.string('owner_email').notNullable()
      table.string('owner_password').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
