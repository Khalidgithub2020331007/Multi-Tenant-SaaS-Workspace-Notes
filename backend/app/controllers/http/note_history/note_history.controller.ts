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
      .where('author_user_id', user.id)
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
    if (user.role !== 'owner') {
      throw new Error('only owener are authorized to fetch note history')
    }
    const companyUsers = await User.query()
      .select('id')
      .where('company_hostname', user.company_hostname)
      .orderBy('created_at', 'desc')
    const userIds = companyUsers.map((u) => u.id)
    const histories = await NoteHistory.query()
      .whereIn('author_user_id', userIds) // fetch all note history of company users
      .orderBy('created_at', 'desc') // order by created_at desc
    return response.ok({ message: 'Company note history fetched successfully', histories })
    // return response.ok({
    //   messages: ' Company note history fetched successfully',
    //   histories,
    // })
  }
}
