import { HttpContext } from '@adonisjs/core/http'
export default class NoteHistorySeenMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const { auth, request, response } = ctx
    const noteAuthorId = request.input('author_user_id')
    const user = auth.user
    const check = () => {
      const isOwner = user?.role === 'owner'
      const isAuhor = user?.id === Number(noteAuthorId)
      if (!isOwner && !isAuhor) {
        return response.unauthorized({
          message: 'Only owner or author can perform this action',
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
