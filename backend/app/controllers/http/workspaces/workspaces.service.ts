import Company from '#models/company'
import Workspace from '#models/workspace'
import User from '#models/user'

type WorkspacePayload = {
  workspace_name: string
  company_hostname: string
}

export default class WorkspaceService {
  // Service to create a new workspace
  public async create_workspace(payload: WorkspacePayload, user: User) {
    if (user.role !== 'owner') {
      throw new Error('Only owner can create a workspace')
    }
    // Check if company exists
    const companyExists = await Company.query().where('hostname', payload.company_hostname).first()
    if (!companyExists) {
      throw new Error('Company does not exist')
    }
    // Check if workspace already exists
    const workspaceExists = await Workspace.query()
      .where('workspace_name', payload.workspace_name)
      .andWhere('company_hostname', payload.company_hostname)
      .first()
    if (workspaceExists) {
      throw new Error('Workspace already exists')
    }

    // Create the Workspace
    const workspace = await Workspace.create({
      workspace_name: payload.workspace_name,
      company_hostname: payload.company_hostname,
    })

    return {
      message: 'Workspace created successfully',
      workspace,
    }
  }
  public async delete_workspace(workspace_name: string, company_hostname: string, user: User) {
    if (user.role !== 'owner') {
      throw new Error('Only owner can delete a workspace')
    }
    try {
      const existingWorkspace = await Workspace.query()
        .where('workspace_name', workspace_name)
        .andWhere('company_hostname', company_hostname)
        .first()
      if (!existingWorkspace) {
        throw new Error('Workspace does not exist')
      }

      await existingWorkspace.delete()

      return {
        message: 'Workspace deleted successfully',
        workspace: existingWorkspace,
      }
    } catch (error) {
      throw new Error(`Failed to delete workspace: ${error.message}`)
    }
  }
  public async get_all_workspaces(user: User) {
    try {
      const workspaces = await Workspace.query()
        .select('workspace_name')
        .where('company_hostname', user.company_hostname)
        .orderBy('created_at', 'desc')

      return {
        message: 'Workspaces fetched successfully',
        workspaces,
      }
    } catch (error) {
      throw new Error(`Failed to fetch workspaces: ${error.message}`)
    }
  }
  public async get_specifiec_workspace(id: number, user: User) {
    try {
      const workspace = await Workspace.query().select('*').where('id', id).first()
      if (!workspace) {
        throw new Error('Workspace does not exist')
      }
      if (workspace.company_hostname !== user.company_hostname) {
        throw new Error('You can not fetch another company workspace')
      }

      return {
        message: 'Workspace fetched successfully',
        workspace,
      }
    } catch (error) {
      throw new Error(`Failed to fetch workspace: ${error.message}`)
    }
  }
}
