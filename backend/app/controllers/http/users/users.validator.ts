import vine from '@vinejs/vine'

export const userRegisterValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2),
    email: vine.string().email(),
    password: vine.string().minLength(8),
    company_hostname: vine.string().minLength(3),
    role: vine.enum(['member'] as const),
  })
)

export const userLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  })
)
