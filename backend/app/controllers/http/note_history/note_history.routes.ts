// note history routes
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const NoteHistoryController = () => import('./note_history.controller.js')

router
  .group(() => {
    router
      .get('/author', [NoteHistoryController, 'get_noteHistory_for_author'])
      .use(middleware.check_note_owner())
    router
      .get('/company_owner', [NoteHistoryController, 'get_noteHistory_for_company_owner'])
      .use(middleware.check_ownerRole())
  })
  .prefix('/note_history')
  .use([middleware.auth()])
