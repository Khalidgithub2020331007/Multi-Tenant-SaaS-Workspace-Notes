// user routes
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const UserRegisterController = () => import('./users.controller.js')

router
  .group(() => {
    router.post('/register', [UserRegisterController, 'user_register'])
    router.post('/login', [UserRegisterController, 'user_login'])
    router.get('/me', [UserRegisterController, 'get_profile']).use(middleware.auth())
    router.post('/logout', [UserRegisterController, 'user_logout']).use(middleware.auth())
  })
  .prefix('/user')
