import { HttpContext } from '@adonisjs/core/http'

export default class CheckOwnerRoleMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    // console.log('ctx', ctx)
    const { auth, response } = ctx

    const user = auth.user
    const check = () => {
      if (user?.role !== 'owner') {
        return response.unauthorized({
          message: 'Only owner can perform this action',
        })
      }

      return true
    }
    const valid = check()
    if (valid !== true) {
      return
    }
    await next()
  }
}
