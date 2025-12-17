import { HttpContext } from '@adonisjs/core/http'
import NoteHistory from '#models/note_history'
import User from '#models/user'
export default class NoteHistoryController {
  public async get_noteHistory_for_author({ response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      throw new Error('User not authenticated')
    }
    const histories = await NoteHistory.query()
      .whereIn('author_user_id', user.id)
      .orderBy('created_at', 'desc')

    return response.ok({
      message: 'Your note history  fetched successfully',
      histories,
    })
  }
  public async get_noteHistory_for_company_owner({ response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      throw new Error('User not authenticated')
    }
    const companyUsers = await User.query()
      .select('id')
      .where('company_hostname', user.company_hostname)
    const userIds = companyUsers.map((u) => u.id)
    const histories = await NoteHistory.query()
      .where('author_user_id', userIds)
      .orderBy('created_at', 'desc')
    return response.ok({
      messages: ' Company note history fetched successfully',
      histories,
    })
  }
}
