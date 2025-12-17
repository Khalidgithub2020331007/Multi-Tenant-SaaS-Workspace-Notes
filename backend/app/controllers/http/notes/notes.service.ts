// note service

import Note from '#models/note'
import User from '#models/user'
import Workspace from '#models/workspace'
import NoteHistoryService from '../note_history/note_history.service.js'
import db from '@adonisjs/lucid/services/db'

type NotePayload = {
  title: string
  content: string

  note_type: 'draft' | 'public' | 'private'
}
type NoteCreatePayload = {
  title: string
  content: string
  workspace_id: number
  note_type: 'draft' | 'public' | 'private'
}

export default class NoteService {
  private historyService = new NoteHistoryService()

  public async createNote(payload: NoteCreatePayload, user: User) {
    const trx = await db.transaction()
    try {
      // Check if workspace exists
      const workspace = await Workspace.query({ client: trx })
        .where('id', payload.workspace_id)
        .first()
      if (!workspace) {
        throw new Error('Workspace does not exist')
      }

      // Check if user is owner of the workspace
      if (user.company_hostname !== workspace.company_hostname) {
        throw new Error('User is not owner of the workspace')
      }

      // Create a new note
      const note = new Note()
      note.useTransaction(trx)
      note.title = payload.title
      note.content = payload.content
      note.workspace_id = workspace.id
      note.author_user_id = user.id
      note.note_type = payload.note_type
      await note.save()

      await this.historyService.record(note, user, 'created', trx)
      await trx.commit()

      return {
        message: 'Note created successfully',
        note,
      }
    } catch (error) {
      await trx.rollback()
      throw new Error(`Failed to create note: ${error.message}`)
    }
  }
  public async deleteNote(note_id: number, user: User) {
    const trx = await db.transaction()
    try {
      const note = await Note.query({ client: trx }).where('id', note_id).first()
      if (!note) {
        throw new Error('Note does not exist')
      }
      note.useTransaction(trx)
      await this.historyService.record(note, user, 'deleted', trx)
      await note.delete()
      await trx.commit()
      return {
        message: 'Note deleted successfully',
        note,
      }
    } catch (error) {
      await trx.rollback()
      throw new Error(`Failed to delete note: ${error.message}`)
    }
  }
  public async updateNote(note_id: number, payload: NotePayload, user: User) {
    const trx = await db.transaction()
    try {
      const note = await Note.query({ client: trx }).where('id', note_id).first()
      if (!note) {
        throw new Error('Note does not exist')
      }
      note.useTransaction(trx)
      note.title = payload.title
      note.content = payload.content
      note.note_type = payload.note_type
      await note.save()

      await this.historyService.record(note, user, 'updated',trx)
      await trx.commit()

      return {
        message: 'Note updated successfully',
        note,
      }
    } catch (error) {
      await trx.rollback()
      throw new Error(`Failed to update note: ${error.message}`)
    }
  }
  public async searchNote(title: string) {
    try {
      const note = await Note.query().whereILike('title', title).first()
      if (!note) {
        throw new Error('Note does not exist')
      }
      return {
        message: 'Note found successfully',
        note,
      }
    } catch (error) {
      throw new Error(`Failed to find note: ${error.message}`)
    }
  }
  public async shownotes(company_hostname: string) {
    try {
      const note = await Note.query().where('company_hostname', company_hostname).first()
      if (!note) {
        throw new Error('Note does not exist')
      }
      return {
        message: 'Note found successfully',
        note,
      }
    } catch (error) {
      throw new Error(`Failed to find note: ${error.message}`)
    }
  }
}
