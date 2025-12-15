import Company from '#models/company'
import Workspace from '#models/workspace'

type WorkspacePayload = {
  workspace_name: string
  company_hostname: string
}

export default class WorkspaceService {
  // Service to create a new workspace
  public async create_workspace(payload: WorkspacePayload) {
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
  public async delete_workspace(workspace_name: string, company_hostname: string) {
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
  public async get_all_workspaces() {
    try {
      const workspaces = await Workspace.query().select('*')

      return {
        message: 'Workspaces fetched successfully',
        workspaces,
      }
    } catch (error) {
      throw new Error(`Failed to fetch workspaces: ${error.message}`)
    }
  }
  public async get_specifiec_workspace(id: number) {
    try {
      const workspace = await Workspace.query().where('id', id).first()

      return {
        message: 'Workspace fetched successfully',
        workspace,
      }
    } catch (error) {
      throw new Error(`Failed to fetch workspace: ${error.message}`)
    }
  }
}
