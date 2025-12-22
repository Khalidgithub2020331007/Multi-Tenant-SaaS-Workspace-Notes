import vine from '@vinejs/vine'

export const voteValidator = vine.compile(
  vine.object({
    note_id: vine.number(),
    vote_value: vine.enum([1, -1] as const),
  })
)
