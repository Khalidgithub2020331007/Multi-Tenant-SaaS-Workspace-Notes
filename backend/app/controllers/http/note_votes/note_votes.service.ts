import NoteVote from '#models/note_vote'
import Note from '#models/note'
import User from '#models/user'

export default class NoteVoteService {
  public async record(note: Note, user: User, voteValue: 1 | -1) {
    const existingVote = await NoteVote.query()
      .where('note_id', note.id)
      .andWhere('voter_user_id', user.id)
      .first()

    if (existingVote) {
      if (existingVote.vote_value !== voteValue) {
        if (existingVote.vote_value === 1) {
          note.upvotes -= 1
          note.downvotes += 1
        } else {
          note.upvotes += 1
          note.downvotes -= 1
        }
        await existingVote.save()
        await note.save()
      }
      return {
        message: 'Vote recorded',
        upvotes: note.upvotes,
      }
    }
    await NoteVote.create({
      note_id: note.id,
      voter_user_id: user.id,
      vote_value: voteValue,
    })
    if (voteValue === 1) note.upvotes += 1
    else note.downvotes += 1

    await note.save()

    return {
      message: 'Vote recorded',
      upvotes: note.upvotes,
      downvotes: note.downvotes,
    }
  }
}
