// import NoteVote from '#models/note_vote'
// import Note from '#models/note'
// import User from '#models/user'
// import db from '@adonisjs/lucid/services/db'

// type VotePayload = {
//   note_id: number
//   vote_value: 1 | -1
// }

// export default class NoteVoteService {
//   public async castVote(payload: VotePayload, user: User) {
//     const trx = await db.transaction()
//     try {
//       const { note_id, vote_value } = payload

//       // Find the note
//       const note = await Note.query({ client: trx }).where('id', note_id).first()
//       if (!note) throw new Error('Note does not exist')

//       // Check if user already voted
//       let noteVote = await NoteVote.query({ client: trx })
//         .where('note_id', note_id)
//         .where('voter_user_id', user.id)
//         .first()

//       if (noteVote) {
//         if (noteVote.vote_value !== vote_value) {
//           noteVote.vote_value = vote_value
//           await noteVote.useTransaction(trx).save()
//         } else {
//           throw new Error('You already voted the same')
//         }
//       } else {
//         noteVote = new NoteVote()
//         noteVote.useTransaction(trx)
//         noteVote.note_id = note_id
//         noteVote.voter_user_id = user.id
//         noteVote.vote_value = vote_value
//         await noteVote.save()
//       }

//       // ===== Optimized Note vote count update =====
//       const counts = await NoteVote.query({ client: trx })
//         .where('note_id', note_id)
//         .select(db.raw('SUM(CASE WHEN vote_value=1 THEN 1 ELSE 0 END) as upvotes'))
//         .select(db.raw('SUM(CASE WHEN vote_value=-1 THEN 1 ELSE 0 END) as downvotes'))
//         .firstOrFail()

//       note.upvotes = Number(counts.upvotes)
//       note.downvotes = Number(counts.downvotes)
//       note.totalvotes = note.upvotes - note.downvotes
//       await note.useTransaction(trx).save()

//       await trx.commit()
//       return {
//         message: 'Vote processed successfully',
//         note,
//         vote: noteVote,
//       }
//     } catch (error) {
//       await trx.rollback()
//       throw new Error(`Failed to cast vote: ${error.message}`)
//     }
//   }
// }
