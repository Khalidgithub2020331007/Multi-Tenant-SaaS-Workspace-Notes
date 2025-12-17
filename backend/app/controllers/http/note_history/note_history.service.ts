// note history service
import NoteHistory from '#models/note_history'
import User from '#models/user'
import Note from '#models/note'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export type HistoryStatus = 'created' | 'updated' | 'deleted'

export default class NoteHistoryService {
  public async record(note: Note, user: User, status: HistoryStatus, trx?:TransactionClientContract) {
    const history = new NoteHistory()
    if (trx){
      history.useTransaction(trx)
    }
    
      history.note_id= note.id
      history.status_type= status
      history.note_title= note.title
      history.note_content= note.content
      history.author_user_id= user.id
      await history.save()
  
  }
}
