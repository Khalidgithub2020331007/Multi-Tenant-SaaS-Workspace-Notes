// app/controllers/company_register_controller.ts

import { HttpContext } from '@adonisjs/core/http'
import CompanyRegisterService from './companies.service.js'
import { companyRegisterValidator } from './companies.validator.js'

export default class CompanyRegisterController {
  private service: CompanyRegisterService

  constructor() {
    this.service = new CompanyRegisterService()
  }

  /**
   * Register a new company with owner user
   */
  public async company_register({ request, response }: HttpContext) {
    try {
      // 1️⃣ Validate the request data
      const payload = await request.validateUsing(companyRegisterValidator)

      // 2️⃣ Call the service to register company & owner
      const result = await this.service.company_register(payload)

      // 3️⃣ Return success response
      return response.created({
        message: 'Company registered successfully',
        company: result.company,
        user: result.user,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation failed',
          // errors: error.messages,
        })
      }

      return response.conflict({
        message: 'Company already exists',
      })
    }
  }
}
