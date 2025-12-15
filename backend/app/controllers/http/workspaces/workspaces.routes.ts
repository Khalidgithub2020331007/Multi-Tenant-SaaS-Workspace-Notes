import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const WorkspaceController = () => import('./workspaces.controller.js')
router
  .group(() => {
    router
      .post('/create', [WorkspaceController, 'create_workspace'])
      .use([middleware.check_ownerRole(), middleware.check_hostname()])
    router
      .post('/delete', [WorkspaceController, 'delete_workspace'])
      .use([middleware.check_ownerRole(), middleware.check_hostname()])
    router.get('/all', [WorkspaceController, 'get_all_workspaces'])
    router
      .get('/:id', [WorkspaceController, 'get_specifiec_workspace'])
      .use(middleware.check_hostname())
  })
  .prefix('/workspace')
  .use([middleware.auth()])
