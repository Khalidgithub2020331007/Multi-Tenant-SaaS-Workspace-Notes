import { HttpContext } from '@adonisjs/core/http'
export default class CheckNoteOwnerMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    // console.log('ctx', ctx)
    const { auth, response, request } = ctx
    const noteAuthorUserId = request.input('author_user_id')
    const user = auth.user
    const check = () => {
      if (user?.id !== noteAuthorUserId) {
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
