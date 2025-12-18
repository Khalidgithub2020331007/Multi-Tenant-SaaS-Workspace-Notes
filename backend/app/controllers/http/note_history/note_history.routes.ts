// note history routes
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const NoteHistoryController = () => import('./note_history.controller.js')

router
  .group(() => {
    router.get('/author', [NoteHistoryController, 'get_noteHistory_for_author'])

    router.get('/company_owner', [NoteHistoryController, 'get_noteHistory_for_company_owner'])
  })
  .prefix('/note_history')
  .use([middleware.auth()])
