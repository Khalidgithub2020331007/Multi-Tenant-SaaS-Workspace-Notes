// note service

import Note from '#models/note'
import User from '#models/user'
import Workspace from '#models/workspace'
import NoteHistoryService from '../note_history/note_history.service.js'
import db from '@adonisjs/lucid/services/db'
import NoteVote from '#models/note_vote'

type NotePayload = {
  title: string
  content: string

  note_type: 'draft' | 'public' | 'private'
  created_at?: string
}
type NoteCreatePayload = {
  title: string
  content: string
  workspace_id: number
  company_hostname: string
  note_type: 'draft' | 'public' | 'private'
  created_at?: string
  tags?: number[]
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
      note.company_hostname = user.company_hostname
      await note.save()

      if (payload.tags) {
        const tagIds = Array.isArray(payload.tags) ? payload.tags : [payload.tags]
        await note.related('tags').attach(tagIds)
      }

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
      if (user.role !== 'owner' && note.author_user_id !== user.id) {
        throw new Error('Only note owner or company owner can delete a note')
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
      if (note.author_user_id !== user.id) {
        throw new Error('Only note owner can update his note')
      }
      note.useTransaction(trx)
      note.title = payload.title
      note.content = payload.content
      note.note_type = payload.note_type
      await note.save()

      await this.historyService.record(note, user, 'updated', trx)
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
  public async searchNote(title: string, user: User) {
    try {
      const note = await Note.query()
        .where('title', 'like', `%${title}%`)
        .where('company_hostname', user.company_hostname)
      if (!note) {
        throw new Error('Note does not exist')
      }
      // if (note[0].company_hostname !== user.company_hostname) {
      //   throw new Error('Only the company member can search')
      // }
      return {
        message: 'Note found successfully',
        note,
      }
    } catch (error) {
      throw new Error(`Failed to find note: ${error.message}`)
    }
  }
  public async public_shownotes(
    user: User,
    page: number = 1,
    limit: number = 20,
    search: string = '',
    sort: 'new' | 'old' | 'upvotes' | 'downvotes' = 'new'
  ) {
    try {
      limit = Math.min(limit || 20, 20)
      let query = Note.query()
        .where('company_hostname', user.company_hostname)
        .where('note_type', 'public')
        .whereILike('title', `${search}%`)
        .preload('workspace', (q) => {
          q.select('id', 'workspace_name')
        })
      // Apply sorting
      switch (sort) {
        case 'new':
          query.orderBy('created_at', 'desc')
          break
        case 'old':
          query.orderBy('created_at', 'asc')
          break
        case 'upvotes':
          query.orderBy('upvotes', 'desc')
          break
        case 'downvotes':
          query.orderBy('downvotes', 'desc')
          break
      }

      // console.log('SQL Query:', query.toQuery())

      const notes = await query.paginate(page, limit)

      if (!notes.all().length) {
        throw new Error('Note does not exist')
      }

      const mappedNotes = notes.all().map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        noteType: note.note_type,
        createdAt: note.createdAt,
        workspaceName: note.workspace.workspace_name,
        upvotes: note.upvotes,
        downvotes: note.downvotes,
        totalvotes: note.upvotes - note.downvotes,
        authorUserId: note.author_user_id,
      }))

      return {
        message: 'Public notes fetched successfully',
        notes: mappedNotes,
        meta: notes.getMeta(),
      }
    } catch (error) {
      throw new Error(`Failed to find note: ${error.message}`)
    }
  }
  public async private_draft_shownotes(user: User) {
    const notes = await Note.query()
      .where('company_hostname', user.company_hostname)
      .where('author_user_id', user.id)
      .where((query) => {
        query.where('note_type', 'private').orWhere('note_type', 'draft')
      })
      .orderBy('created_at', 'desc')

    return {
      message: 'Private and draft notes fetched successfully',
      notes,
    }
  }
  public async get_author_notes(user: User, page = 1, limit = 20) {
    limit = Math.min(limit, 20)

    const notes = await Note.query()
      .where('company_hostname', user.company_hostname)
      .where('author_user_id', user.id)
      .select(['id', 'title', 'content', 'note_type', 'created_at', 'workspace_id'])
      .preload('workspace', (q) => {
        q.select('id', 'workspace_name')
      })
      .preload('tags', (q) => {
        q.select('id', 'tag_name')
      })
      .paginate(page, limit)

    // console.log(
    //   'SQL: ',
    //   Note.query()
    //     .where('company_hostname', user.company_hostname)
    //     .where('author_user_id', user.id)
    //     .select(['id', 'title', 'content', 'note_type', 'created_at', 'workspace_id'])
    //     .preload('workspace', (q) => {
    //       q.select('id', 'workspace_name')
    //     })
    //     .preload('tags', (q) => {
    //       q.select('id', 'tag_name')
    //     })
    //     .toQuery()
    // )

    return {
      message: 'Author notes fetched successfully',
      meta: notes.getMeta(),
      notes: notes.all().map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        noteType: note.note_type,
        createdAt: note.createdAt,
        workspaceName: note.workspace?.workspace_name ?? null,
        tag: note.tags?.map((t) => t.tag_name) ?? [],
      })),
    }
  }

  public async voteNote(noteId: number, voteType: 'upvote' | 'downvote', user: User) {
    const trx = await db.transaction()
    try {
      const note = await Note.query({ client: trx }).where('id', noteId).first()
      if (!note) {
        throw new Error('Note does not exist')
      }
      if (note.company_hostname !== user.company_hostname) {
        throw new Error('Only company members can vote on notes')
      }
      note.useTransaction(trx)
      const existingVote = await NoteVote.query({ client: trx })
        .where('note_id', noteId)
        .andWhere('voter_user_id', user.id)
        .first()
      const newVoteValue = voteType === 'upvote' ? 1 : -1

      if (!existingVote) {
        // Create new vote
        await NoteVote.create(
          {
            note_id: noteId,
            voter_user_id: user.id,
            vote_value: newVoteValue,
          },
          { client: trx }
        )
        if (newVoteValue === 1) {
          note.upvotes += 1
        } else {
          note.downvotes += 1
        }
        await note.save()

        await trx.commit()
        return { message: 'Vote recorded successfully', note }
      } else {
        // Update existing vote
        if (existingVote.vote_value === newVoteValue) {
          await trx.commit()
          return { message: 'Vote unchanged', note }
        }
        if (existingVote.vote_value === 1 && newVoteValue === -1) {
          note.upvotes -= 1
          note.downvotes += 1
        }
        if (existingVote.vote_value === -1 && newVoteValue === 1) {
          note.downvotes -= 1
          note.upvotes += 1
        }
        existingVote.vote_value = newVoteValue
        await existingVote.save()
        await note.save()

        await trx.commit()
        return { message: 'Vote updated successfully', note }
      }
    } catch (error) {
      await trx.rollback()
      throw new Error(`Failed to vote on note: ${error.message}`)
    }
  }
}
