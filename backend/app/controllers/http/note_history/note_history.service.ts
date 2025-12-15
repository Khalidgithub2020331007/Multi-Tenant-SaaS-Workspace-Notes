// note history service
import NoteHistory from '#models/note_history'
import User from '#models/user'
import Note from '#models/note'

export type HistoryStatus = 'created' | 'updated' | 'deleted'

export default class NoteHistoryService {
  public async record(note: Note, user: User, status: HistoryStatus) {
    await NoteHistory.create({
      note_id: note.id,
      status_type: status,
      note_title: note.title,
      note_content: note.content,
      author_user_id: user.id,
    })
  }
}
