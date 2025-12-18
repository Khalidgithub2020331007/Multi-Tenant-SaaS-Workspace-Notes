import NoteVote from '#models/note_vote'
import Note from '#models/note'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class NoteVoteService {
  public async record(note: Note, user: User, voteValue: 1 | -1) {
    return db.transaction(async (trx) => {
      // find existing vote
      const existingVote = await NoteVote.query({ client: trx })
        .where('note_id', note.id)
        .andWhere('voter_user_id', user.id)
        .first()

      // 🔁 Vote exists → change vote
      if (existingVote) {
        if (existingVote.vote_value === voteValue) {
          const current = await Note.query({ client: trx }).where('id', note.id).first()
          if (!current) return { message: 'Note not found' }

          return {
            message: 'Vote already applied',
            upvotes: current.upvotes,
            downvotes: current.downvotes,
          }
        }

        // remove old vote
        if (existingVote.vote_value === 1) {
          await Note.query({ client: trx }).where('id', note.id).decrement('upvotes', 1)
        } else {
          await Note.query({ client: trx }).where('id', note.id).decrement('downvotes', 1)
        }

        // apply new vote
        if (voteValue === 1) {
          await Note.query({ client: trx }).where('id', note.id).increment('upvotes', 1)
        } else {
          await Note.query({ client: trx }).where('id', note.id).increment('downvotes', 1)
        }

        existingVote.vote_value = voteValue
        existingVote.useTransaction(trx)
        await existingVote.save()

        const updated = await Note.query({ client: trx }).where('id', note.id).first()
        if (!updated) return { message: 'Note not found' }

        return {
          message: 'Vote updated',
          upvotes: updated.upvotes,
          downvotes: updated.downvotes,
        }
      }

      // 🆕 First-time vote
      await NoteVote.create(
        {
          note_id: note.id,
          voter_user_id: user.id,
          vote_value: voteValue,
        },
        { client: trx }
      )

      if (voteValue === 1) {
        await Note.query({ client: trx }).where('id', note.id).increment('upvotes', 1)
      } else {
        await Note.query({ client: trx }).where('id', note.id).increment('downvotes', 1)
      }

      const updated = await Note.query({ client: trx }).where('id', note.id).first()
      if (!updated) return { message: 'Note not found' }

      return {
        message: 'Vote recorded',
        upvotes: updated.upvotes,
        downvotes: updated.downvotes,
      }
    })
  }
}
