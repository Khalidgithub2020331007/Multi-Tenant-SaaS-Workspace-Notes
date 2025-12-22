// import { HttpContext } from '@adonisjs/core/http'
// import NoteVoteService from './note_vote.service.js'
// import { voteValidator } from './note_vote.validator.js'

// export default class NoteVoteController {
//   private service = new NoteVoteService()

//   public async vote({ request, response, auth }: HttpContext) {
//     try {
//       const user = auth.user
//       if (!user) throw new Error('User not authenticated')

//       const payload = await request.validateUsing(voteValidator)
//       const result = await this.service.castVote(payload, user)

//       return response.ok({
//         message: result.message,
//         note: result.note,
//         vote: result.vote,
//       })
//     } catch (error) {
//       return response.badRequest({
//         message: error.message,
//       })
//     }
//   }
// }
