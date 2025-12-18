import vine from '@vinejs/vine'

export const WorkspaceValidator = vine.compile(
  vine.object({
    workspace_name: vine.string().minLength(2).maxLength(100),
    company_hostname: vine.string(),
  })
)
export const workspaceDeleteValidator = vine.compile(
  vine.object({
    workspace_name: vine.string().minLength(2).maxLength(100),
    company_hostname: vine.string(),
  })
)
