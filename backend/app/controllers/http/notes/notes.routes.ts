// note routes

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const NoteController = () => import('./notes.controller.js')

router
  .group(() => {
    router.post('/create', [NoteController, 'create_note'])
    router.delete('/:id', [NoteController, 'delete_note']).use([middleware.check_note_owner()])
    router.patch('/:id', [NoteController, 'update_note']).use([middleware.check_note_owner()])
    router.get('/search', [NoteController, 'search_note'])
    router.get('/show_notes', [NoteController, 'shownotes'])
  })
  .prefix('/note')
  .use([middleware.auth()])
