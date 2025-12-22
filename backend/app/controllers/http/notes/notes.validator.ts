// note validator

import vine, { SimpleMessagesProvider } from '@vinejs/vine'

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
    workspace_id: vine.number(), // ensure not empty
    note_type: vine.enum(['draft', 'public', 'private'] as const),
    company_hostname: vine.string().minLength(1),
    tags: vine.array(vine.number()),
  })
)

noteValidator.messagesProvider = new SimpleMessagesProvider({
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

noteCreateValidator.messagesProvider = new SimpleMessagesProvider({
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
