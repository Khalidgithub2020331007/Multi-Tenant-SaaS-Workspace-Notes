import router from '@adonisjs/core/services/router'
const CompanyRegisterController = () => import('./companies.controller.js')

router.post('/company/register', [CompanyRegisterController, 'company_register'])
