import vine, { SimpleMessagesProvider } from '@vinejs/vine'

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

workspaceDeleteValidator.messagesProvider = new SimpleMessagesProvider({
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
WorkspaceValidator.messagesProvider = new SimpleMessagesProvider({
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
