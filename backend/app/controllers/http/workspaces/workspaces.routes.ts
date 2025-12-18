import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const WorkspaceController = () => import('./workspaces.controller.js')
router
  .group(() => {
    router.post('/create', [WorkspaceController, 'create_workspace'])

    router.post('/delete', [WorkspaceController, 'delete_workspace'])

    router.get('/all', [WorkspaceController, 'get_all_workspaces'])
    router.get('/:id', [WorkspaceController, 'get_specifiec_workspace'])
  })
  .prefix('/workspace')
  .use([middleware.auth()])
