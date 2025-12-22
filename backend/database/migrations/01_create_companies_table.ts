// database/migrations/xxxx_companies.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('company_id').primary()
      table.string('hostname').notNullable().unique()
      table.string('company_name').notNullable()
      table.string('owner_name').notNullable()
      table.string('owner_email').notNullable().unique()
      table.string('owner_password').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
