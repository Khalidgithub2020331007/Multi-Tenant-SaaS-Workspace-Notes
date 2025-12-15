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
    title: vine
      .string()
      .minLength(3)
      .regex(/^[a-zA-Z0-9\s]+$/),
    content: vine.string(),
    workspace_id: vine.number(),
    note_type: vine.enum(['draft', 'public', 'private'] as const),
    compnay_hostname: vine.string(),
  })
)
