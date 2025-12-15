import Company from '#models/company'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

type UserRegisterPayload = {
  name: string
  email: string
  password: string
  company_hostname: string
  role: 'member'
}

export default class UserRegisterService {
  /**
   * Register a new user under a company
   */
  public async user_register(payload: UserRegisterPayload) {
    //chech if company exists
    const companyExists = await Company.query().where('hostname', payload.company_hostname).first()
    if (!companyExists) {
      throw new Error('Company does not exist')
    }
    // Before creating user
    const existingUser = await User.query().where('email', payload.email).first()
    if (existingUser) {
      throw new Error('User already exists')
    }
    // 1️⃣ Hash the user password

    // 2️⃣ Create the User
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      company_hostname: payload.company_hostname,
      role: 'member',
    })

    return {
      message: 'User registered successfully',
      user,
    }
  }
  public async user_login(email: string, password: string) {
    // 1️⃣ Find the user by email and password
    const user = await User.query().where('email', email).first()
    const isPasswordValid = user ? await hash.verify(user.password, password) : false
    if (!user || !isPasswordValid) {
      throw new Error('Invalid Credentials')
    }

    return {
      message: 'User logged in successfully',
      user,
    }
  }
}
