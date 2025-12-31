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
        // errors: error.messages || error.message,
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
        // errors: error.messages || error.message,
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
        // errors: error.messages || error.message,
      })
    }
  }
  public async search_note({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const title = request.input('title')
      const result = await this.service.searchNote(title, user)

      return response.ok({
        message: result.message,
        note: result.note,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Note search failed',
        // errors: error.messages || error.message,
      })
    }
  }
  public async public_shownotes({ response, auth, request }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const page = Number(request.input('page', 1))
      let limit = Math.min(Number(request.input('limit', 20)), 20)
      limit = Math.min(limit, 20)
      const search = request.input('search', '')
      const sort = request.input('sort', 'new') as 'new' | 'old' | 'upvotes' | 'downvotes'
      const result = await this.service.public_shownotes(user, page, limit, search, sort)

      return response.ok({
        message: result.message,
        note: result.notes,
        meta: result.meta,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Note search failed',
        // errors: error.messages || error.message,
      })
    }
  }
  public async private_shownotes({ response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const result = await this.service.private_draft_shownotes(user)

      return response.ok({
        message: result.message,
        note: result.notes,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Note search failed',
        // errors: error.messages || error.message,
      })
    }
  }
  public async author_notes({ response, auth, request }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Not authenticated' })
    }

    const page = Number(request.input('page', 1))
    const limit = Math.min(Number(request.input('limit', 20)), 20)

    const result = await this.service.get_author_notes(user, page, limit)

    return response.ok(result)
  }

  public async vote_note({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user

      if (!user) {
        throw new Error('User not authenticated')
      }
      const noteId = Number(request.params().id)
      const newVoteValue = request.input('vote_value')
      console.log('🟡 Voting on note:', { noteId, newVoteValue })
      if (![1, -1].includes(newVoteValue)) {
        throw new Error('Invalid vote value')
      }
      const result = await this.service.voteNote(
        noteId,
        newVoteValue === 1 ? 'upvote' : 'downvote',
        user
      )

      return response.ok({
        message: 'Note voted successfully',
        note: {
          id: result.note.id,
          upvotes: result.note.upvotes,
          downvotes: result.note.downvotes,
        },
      })
    } catch (error) {
      return response.badRequest({
        message: 'Note voting failed',
        // errors: error.messages || error.message,
      })
    }
  }
}
