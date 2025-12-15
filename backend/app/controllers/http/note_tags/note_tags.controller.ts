// note tag controller

import { HttpContext } from '@adonisjs/core/http'
import NoteTagsService from './note_tags.service.js'
import { noteTagsValidator } from './note_tags.validator.js'

export default class NoteTagsController {
  private service: NoteTagsService

  constructor() {
    this.service = new NoteTagsService()
  }

  /**
   * Create a new noteTag
   */
  public async create_noteTag({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(noteTagsValidator)

      const result = await this.service.createNoteTag(payload)

      return response.created({
        message: result.message,
        noteTag: result.noteTag,
      })
    } catch (error) {
      return response.badRequest({
        message: 'NoteTag creation failed',
        errors: error.messages || error.message,
      })
    }
  }
  public async delete_noteTag({ request, response }: HttpContext) {
    try {
      const noteId = Number(request.params().note_id)
      const tagId = Number(request.params().tag_id)
      const result = await this.service.deleteNoteTag(noteId, tagId)

      return response.ok({
        message: result.message,
        noteTag: result.noteTag,
      })
    } catch (error) {
      return response.badRequest({
        message: 'NoteTag deletion failed',
        errors: error.messages || error.message,
      })
    }
  }
}
