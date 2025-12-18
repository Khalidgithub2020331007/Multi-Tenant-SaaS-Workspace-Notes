// note tag service

import NoteTag from '#models/note_tag'
import User from '#models/user'

type NoteTagPayload = {
  note_id: number
  tag_id: number
}

export default class NoteTagsService {
  public async createNoteTag(payload: NoteTagPayload, user: User) {
    if (user.role !== 'owner') {
      throw new Error('Only owners can create noteTags')
    }
    try {
      const existing = await NoteTag.query()
        .where('note_id', payload.note_id)
        .andWhere('tag_id', payload.tag_id)
        .first()
      if (existing) {
        throw new Error('NoteTag already added')
      }
      const noteTag = new NoteTag()
      noteTag.note_id = payload.note_id
      noteTag.tag_id = payload.tag_id
      await noteTag.save()

      return {
        message: 'NoteTag created successfully',
        noteTag,
      }
    } catch (error) {
      throw new Error(`Failed to create noteTag: ${error.message}`)
    }
  }
  public async deleteNoteTag(note_id: number, tag_id: number, user: User) {
    if (user.role !== 'owner') {
      throw new Error('Only owners can delete noteTags')
    }
    try {
      const noteTag = await NoteTag.query()
        .where('note_id', note_id)
        .where('tag_id', tag_id)
        .first()
      if (!noteTag) {
        throw new Error('NoteTag does not exist')
      }
      await noteTag.delete()

      return {
        message: 'NoteTag deleted successfully',
        noteTag,
      }
    } catch (error) {
      throw new Error(`Failed to delete noteTag: ${error.message}`)
    }
  }
}
