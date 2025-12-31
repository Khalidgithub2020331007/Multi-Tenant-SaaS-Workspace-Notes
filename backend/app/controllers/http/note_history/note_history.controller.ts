import { HttpContext } from '@adonisjs/core/http'
import NoteHistory from '#models/note_history'
export default class NoteHistoryController {
  public async get_noteHistory_for_author({ response, auth }: HttpContext) {
    const user = auth.user

    const histories = await NoteHistory.query()
      .where('author_user_id', user!.id)
      .orderBy('created_at', 'desc')

    return response.ok({
      message: 'Your note history  fetched successfully',
      histories,
    })
  }
  public async get_noteHistory_for_company_owner({ response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Authentication required' })
    }
    if (user.role !== 'owner') {
      return response.forbidden({ message: 'Only company owners can access company note history' })
    }
    const histories = await NoteHistory.query()
      .join('users', 'note_histories.author_user_id', 'users.id')
      .where('users.company_hostname', user.company_hostname)
    return response.ok({ message: 'Company note history fetched successfully', histories })
    // return response.ok({
    //   messages: ' Company note history fetched successfully',
    //   histories,
    // })
  }
}
