import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'
import Workspace from '#models/workspace'

export default class FullSeeder extends BaseSeeder {
  public async run() {
    try {
      // --------------------------
      // 1) Seed company (parent)
      // --------------------------
      const COMPANY_HOSTNAME = 'demo.company'
      console.log('Seeding company...')

      // Insert a company row so workspace.company_hostname FK won't fail
      await db.table('companies').insert({
        hostname: COMPANY_HOSTNAME,
        company_name: 'Demo Company',
        owner_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        owner_email: `owner@${COMPANY_HOSTNAME}`,
        owner_password: 'password', // for real apps you should hash this
        created_at: new Date(),
        updated_at: new Date(),
      })
      console.log(`Seeded company: ${COMPANY_HOSTNAME}`)

      // --------------------------
      // 2) Seed workspaces (10k)
      // --------------------------
      const TOTAL_WORKSPACES = 10_000
      const WORKSPACE_CHUNK = 500

      console.log('Seeding workspaces...')
      for (let i = 0; i < TOTAL_WORKSPACES; i += WORKSPACE_CHUNK) {
        const chunkSize = Math.min(WORKSPACE_CHUNK, TOTAL_WORKSPACES - i)
        const workspaces = Array.from({ length: chunkSize }, () => ({
          workspace_name: faker.company.name(),
          company_hostname: COMPANY_HOSTNAME,
          created_at: new Date(),
          updated_at: new Date(),
        }))

        await db.table('workspaces').insert(workspaces)
        console.log(`  → Seeded workspaces: ${i + chunkSize}/${TOTAL_WORKSPACES}`)
      }

      // --------------------------
      // 3) Seed notes (5M)
      // --------------------------
      const TOTAL_NOTES = 5_000_000
      // If your machine has limited RAM/DB throughput, reduce NOTE_CHUNK to 500 or 200
      const NOTE_CHUNK = 1000

      console.log('Fetching workspace ids...')

      const workspaceRows = await Workspace.query().select('id')
      const workspaceIds = workspaceRows.map((w) => w.id)

      if (workspaceIds.length === 0) {
        throw new Error('No workspaces found to attach notes to.')
      }

      console.log(`Seeding notes (${TOTAL_NOTES}) in chunks of ${NOTE_CHUNK}...`)
      let inserted = 0

      while (inserted < TOTAL_NOTES) {
        const chunkSize = Math.min(NOTE_CHUNK, TOTAL_NOTES - inserted)
        const notes = Array.from({ length: chunkSize }, () => ({
          workspace_id: faker.helpers.arrayElement(workspaceIds),
          author_user_id: 1, // change if you have seeded users
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(2),
          note_type: faker.helpers.arrayElement(['draft', 'public', 'private']),
          company_hostname: COMPANY_HOSTNAME,
          upvotes: faker.number.int({ min: 0, max: 100 }),
          downvotes: faker.number.int({ min: 0, max: 50 }),
          totalvotes: 0,
          created_at: new Date(),
          updated_at: new Date(),
        }))

        await db.table('notes').insert(notes)
        inserted += chunkSize

        // log every N inserts (here we log every chunk)
        if (inserted % (NOTE_CHUNK * 10) === 0 || inserted === TOTAL_NOTES) {
          const pct = ((inserted / TOTAL_NOTES) * 100).toFixed(2)
          console.log(`  → Inserted notes: ${inserted}/${TOTAL_NOTES} (${pct}%)`)
        }
      }

      console.log('Seeding completed ✅')
    } catch (error) {
      console.error('Seeder failed:', error)
      throw error
    }
  }
}
