import { HttpContext } from '@adonisjs/core/http'
import WorkspaceService from './workspaces.service.js'
import { WorkspaceValidator } from './workspaces.validator.js'
import { workspaceDeleteValidator } from './workspaces.validator.js'

export default class WorkspaceController {
  private service: WorkspaceService

  constructor() {
    this.service = new WorkspaceService()
  }

  public async create_workspace({ request, response, auth }: HttpContext) {
    try {
      // 1️⃣ Validate the request data
      const payload = await request.validateUsing(WorkspaceValidator)
      const user = auth.user
      if (user?.role !== 'owner') {
        throw new Error('User not owener ')
      }
      if (user?.company_hostname !== payload.company_hostname) {
        throw new Error("You can not change another compnay's tag")
      }

      // 2️⃣ Call the service to create workspace
      const result = await this.service.create_workspace(payload, user)

      // 3️⃣ Return success response
      return response.created({
        message: 'Workspace created successfully',
        workspace: result.workspace,
      })
    } catch (error) {
      // 4️⃣ Handle validation or other errors
      return response.badRequest({
        message: 'Workspace creation failed',
        errors: error.messages || error.message,
      })
    }
  }
  public async delete_workspace({ request, response, auth }: HttpContext) {
    try {
      // 1️⃣ Validate the request data
      const payload = await request.validateUsing(workspaceDeleteValidator)
      const user = auth.user
      if (user?.role !== 'owner') {
        throw new Error('User not owener ')
      }
      if (user?.company_hostname !== payload.company_hostname) {
        throw new Error("You can not change another compnay's tag")
      }
      const result = await this.service.delete_workspace(
        payload.workspace_name,
        payload.company_hostname,
        user
      )

      // 3️⃣ Return success response
      return response.created({
        message: result.message,
        workspace: result.workspace,
      })
    } catch (error) {
      // 4️⃣ Handle validation or other errors
      return response.badRequest({
        message: 'Workspace deletion failed',
        errors: error.messages || error.message,
      })
    }
  }
  public async get_all_workspaces({ response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const result = await this.service.get_all_workspaces(user)

      return response.created({
        message: result.message,
        workspaces: result.workspaces,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Workspace fetch failed',
        errors: error.messages || error.message,
      })
    }
  }
  public async get_specifiec_workspace({ response, request, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const { id } = await request.only(['id'])
      const result = await this.service.get_specifiec_workspace(id, user)

      return response.created({
        message: result.message,
        workspace: result.workspace,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Workspace fetch failed',
        errors: error.messages || error.message,
      })
    }
  }
}
