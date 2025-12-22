// note tag validator

import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const noteTagsValidator = vine.compile(
  vine.object({
    note_id: vine.number(),
    tag_id: vine.number(),
  })
)

noteTagsValidator.messagesProvider = new SimpleMessagesProvider({
  string: 'the value of {{field}} must be a required string',
  number: 'the value of {{field}} must be a number',
  boolean: 'the value of {{field}} must be a boolean',
  object: 'the value of {{field}} must be an object',
  array: 'the value of {{field}} must be an array',
  enum: 'the value of {{field}} must be one of {{enum}}',
  any: 'the value of {{field}} is not valid',
  required: 'the value of {{field}} is required',
  minLength: 'the value of {{field}} must be at least {{minLength}} characters long',
  maxLength: 'the value of {{field}} must be at most {{maxLength}} characters long',
  length: 'the value of {{field}} must be {{length}} characters long',
  email: 'the value of {{field}} must be a valid email',
  url: 'the value of {{field}} must be a valid url',
})
