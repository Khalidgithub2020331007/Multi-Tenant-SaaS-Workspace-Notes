// tag validator

import vine from '@vinejs/vine'

export const tagCreateValidator = vine.compile(
  vine.object({
    tag_name: vine
      .string()
      .minLength(3)
      .regex(/^[a-zA-Z0-9\s]+$/),
  })
)
export const tagDeleteValidator = vine.compile(
  vine.object({
    tag_name: vine
      .string()
      .minLength(3)
      .regex(/^[a-zA-Z0-9\s]+$/),
  })
)
