// note validator

import vine from '@vinejs/vine'

export const noteValidator = vine.compile(
  vine.object({
    note_id: vine.number(),
    title: vine
      .string()
      .minLength(3)
      .regex(/^[a-zA-Z0-9\s]+$/),
    content: vine.string(),
    workspace_id: vine.number(),
    author_user_id: vine.number(),
    note_type: vine.enum(['draft', 'public', 'private'] as const),
  })
)

export const noteCreateValidator = vine.compile(
  vine.object({
    title: vine.string(),
    content: vine.string(),
    workspace_id: vine.number(), // ensure not empty
    note_type: vine.enum(['draft', 'public', 'private'] as const),
    company_hostname: vine.string().minLength(1),
    // tags: vine.array(vine.string()), // add this if frontend sends tags
  })
)
