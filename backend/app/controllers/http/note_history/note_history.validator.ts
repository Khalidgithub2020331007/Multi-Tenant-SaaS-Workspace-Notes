// note history validator
import vine from '@vinejs/vine'

export const noteHistoryValidator = vine.compile(
  vine.object({
    note_id: vine.number(),
    status_type: vine.enum(['created', 'updated', 'deleted'] as const),
    note_title: vine.string(),
    note_content: vine.string(),
  })
)
