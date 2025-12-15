/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import '../app/controllers/http/index.js'
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Owner dashboard (temporary)
router.get('/owner/dashboard', async ({ response }) => {
  return response.ok({ message: 'Welcome to OWNER dashboard' })
})

// Member dashboard (temporary)
router.get('/member/dashboard', async ({ response }) => {
  return response.ok({ message: 'Welcome to MEMBER dashboard' })
})
