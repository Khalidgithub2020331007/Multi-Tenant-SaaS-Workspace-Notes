// note controller

import { HttpContext } from '@adonisjs/core/http'
import NoteService from './notes.service.js'
import { noteCreateValidator, noteValidator } from './notes.validator.js'

export default class NoteController {
  private service: NoteService

  constructor() {
    this.service = new NoteService()
  }

  /**
   * Create a new note
   */

  public async create_note({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const payload = await request.validateUsing(noteCreateValidator)

      const result = await this.service.createNote(payload, user)

      return response.created({
        message: result.message,
        note: result.note,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Note creation failed',
        errors: error.messages || error.message,
      })
    }
  }
  public async delete_note({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const noteId = Number(request.params().id)
      const result = await this.service.deleteNote(noteId, user)

      return response.ok({
        message: result.message,
        note: result.note,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Note deletion failed',
        errors: error.messages || error.message,
      })
    }
  }
  public async update_note({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const noteId = Number(request.params().id)
      const payload = await request.validateUsing(noteValidator)
      const result = await this.service.updateNote(noteId, payload, user)

      return response.ok({
        message: result.message,
        note: result.note,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Note update failed',
        errors: error.messages || error.message,
      })
    }
  }
  public async search_note({ request, response }: HttpContext) {
    try {
      const title = request.input('title')
      const result = await this.service.searchNote(title)

      return response.ok({
        message: result.message,
        note: result.note,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Note search failed',
        errors: error.messages || error.message,
      })
    }
  }
  public async shownotes({ response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const companyHostname = user.company_hostname
      const result = await this.service.shownotes(companyHostname)

      return response.ok({
        message: result.message,
        note: result.note,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Note search failed',
        errors: error.messages || error.message,
      })
    }
  }
}
