// app/services/company_register_service.ts

import Company from '#models/company'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

type CompanyRegisterPayload = {
  company_name: string
  hostname: string
  owner_name: string
  owner_password: string
  owner_email: string
}

export default class CompanyRegisterService {
  /**
   * Register a new company and its owner
   */
  public async company_register(payload: CompanyRegisterPayload) {
    const trx = await db.transaction()
    try {
      // Before creating company
      const existingCompany = await Company.query()
        .where('hostname', payload.hostname)
        .orWhere('owner_email', payload.owner_email)
        .first()

      if (existingCompany) {
        throw new Error('Company already exists ')
      }
      // 1️⃣ Hash the owner password
      const hashedPassword = await hash.make(payload.owner_password)

      // 2️⃣ Create Company
      const company = await Company.create(
        {
          company_name: payload.company_name,
          hostname: payload.hostname,
          owner_name: payload.owner_name,
          owner_email: payload.owner_email,
          owner_password: hashedPassword, // store hashed password!
        },
        { client: trx }
      )

      // 3️⃣ Create the Owner User linked to company
      const ownerUser = await User.create(
        {
          name: payload.owner_name,
          email: payload.owner_email || `${payload.hostname}@owner.com`,
          password: payload.owner_password,
          company_hostname: payload.hostname,
          role: 'owner',
        },
        { client: trx }
      )
      await trx.commit()

      return {
        message: 'Company registered successfully',
        company,
        user: ownerUser,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
