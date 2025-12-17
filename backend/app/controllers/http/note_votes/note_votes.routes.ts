import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const NoteVoteController = () => import('./note_votes.controller.js')

router
  .group(() => {
    router.post('/:id/vote', [NoteVoteController, 'vote']).use(middleware.check_hostname())
    router.get('/:id/votes', [NoteVoteController, 'getVote']).use(middleware.check_hostname())
  })
  .prefix('/note_votes')
  .use([middleware.auth()])
