import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const TagController = () => import('./tags.controller.js')

router
  .group(() => {
    router.post('/create', [TagController, 'create_tag'])

    router.post('/delete', [TagController, 'delete_tag'])
    router.get('/all', [TagController, 'get_all_tags'])
  })
  .prefix('/tag')
  .use([middleware.auth()])
