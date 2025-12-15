// note tag validator

import vine from '@vinejs/vine'

export const noteTagsValidator = vine.compile(
  vine.object({
    note_id: vine.number(),
    tag_id: vine.number(),
  })
)
