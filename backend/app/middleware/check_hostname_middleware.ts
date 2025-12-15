import { HttpContext } from '@adonisjs/core/http'
export default class CheckHostnameMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const { auth, request, response } = ctx
    const user = auth.user
    const companyHostname = request.input('company_hostname')
    const check = () => {
      if (user?.company_hostname !== companyHostname) {
        return response.unauthorized({
          message: 'You can not manage another company',
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
