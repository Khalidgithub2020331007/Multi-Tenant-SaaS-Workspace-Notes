import vine from '@vinejs/vine'

export const noteVoteValidator = vine.compile(
  vine.object({
    vote_value: vine.number(),
  })
)
