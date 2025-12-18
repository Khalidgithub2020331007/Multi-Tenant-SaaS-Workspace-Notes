// note routes

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const NoteController = () => import('./notes.controller.js')

router
  .group(() => {
    router.post('/create', [NoteController, 'create_note'])
    router.delete('/:id', [NoteController, 'delete_note'])
    router.patch('/:id', [NoteController, 'update_note'])
    router.get('/search', [NoteController, 'search_note'])
    router.get('/show_notes', [NoteController, 'public_shownotes'])
    router.get('/private_shownotes', [NoteController, 'private_shownotes'])
    router.get('/author_notes', [NoteController, 'author_notes'])
  })
  .prefix('/note')
  .use([middleware.auth()])
