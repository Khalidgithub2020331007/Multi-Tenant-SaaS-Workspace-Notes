import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'
import NoteVoteService from './note_votes.service.js'
export default class NoteVoteController {
  private NoteService = new NoteVoteService()
  public async vote({ params, auth, request, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) return response.notFound({ message: 'Note not found' })

    const user = auth.user
    if (!user) return response.unauthorized({ message: 'Login required' })

    const voteValue = request.input('vote_value') // 1 = upvote, -1 = downvote
    if (![1, -1].includes(voteValue)) {
      return response.badRequest({ message: 'Invalid vote value' })
    }
    const result = await this.NoteService.record(note, user, voteValue)
    return response.ok(result)
  }
  public async getVote({ params, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) return response.notFound({ message: 'Note not found' })
    return response.ok({
      message: 'Note vote fetched successfully',
      upvotes: note.upvotes,
      downvotes: note.downvotes,
    })
  }
}
