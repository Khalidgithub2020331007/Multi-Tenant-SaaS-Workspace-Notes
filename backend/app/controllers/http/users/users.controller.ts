// user controller
import { HttpContext } from '@adonisjs/core/http'
import UserRegisterService from '../users/users.service.js'
import { userRegisterValidator } from '../users/users.validator.js'
import User from '#models/user'

export default class UserRegisterController {
  private service: UserRegisterService

  constructor() {
    this.service = new UserRegisterService()
  }
  public async user_register({ request, response }: HttpContext) {
    try {
      // 1️⃣ Validate the request data
      const payload = await request.validateUsing(userRegisterValidator)

      // 2️⃣ Call the service to register user
      const result = await this.service.user_register(payload)

      // 3️⃣ Return success response
      return response.created({
        message: 'User registered successfully',
        user: result.user,
      })
    } catch (error) {
      // 4️⃣ Handle validation or other errors
      return response.badRequest({
        message: 'User registration failed',
        // errors: error.messages || error.message,
      })
    }
  }
  public async user_login({ request, response, auth }: HttpContext) {
    try {
      // 1️⃣ Validate the request data
      const { email, password } = await request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)

      // 3️⃣ Generate auth token
      await auth.use('web').login(user)
      // 4️⃣ Role Based Redirection Logic
      const redirectUrl = user.role === 'owner' ? '/owner/dashboard' : '/member/dashboard'

      // 5️⃣ Return success response with redirect URL
      return response.ok({
        message: 'User logged in successfully',
        user: user,
        redirectUrl,
      })
    } catch (error) {
      // 4️⃣ Handle validation or other errors
      return response.badRequest({
        message: 'User login failed',
        // errors: error.messages || error.message,
      })
    }
  }
  public async user_logout({ response, auth }: HttpContext) {
    try {
      // 1️⃣ Logout the user
      await auth.use('web').logout()
      // 2️⃣ Return success response
      return response.ok({
        message: 'User logged out successfully',
      })
    } catch (error) {
      // 3️⃣ Handle errors
      return response.badRequest({
        message: 'User logout failed',
        // errors: error.messages || error.message,
      })
    }
  }
  public async get_profile({ response, auth }: HttpContext) {
    try {
      // 1️⃣ Get the authenticated user
      const user = auth.user || null
      // 2️⃣ Return user profile
      return response.ok({
        user,
      })
    } catch (error) {
      // 3️⃣ Handle errors
      return response.badRequest({
        message: 'Unauthorized access',
        // errors: error.messages || error.message,
      })
    }
  }
}
