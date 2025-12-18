//  note tag routes

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const NoteTagsController = () => import('./note_tags.controller.js')

router
  .group(() => {
    router.post('/create', [NoteTagsController, 'create_noteTag'])
    router.delete('/:note_id/:tag_id', [NoteTagsController, 'delete_noteTag'])
  })
  .prefix('/note_tag')
  .use([middleware.auth()])
