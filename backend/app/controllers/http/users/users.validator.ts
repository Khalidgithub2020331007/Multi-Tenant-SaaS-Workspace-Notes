import vine from '@vinejs/vine'

export const userRegisterValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(2)
      .regex(/^[a-zA-Z\s]+$/), // শুধু অক্ষর এবং স্পেস,
    email: vine.string().email(),
    password: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    company_hostname: vine
      .string()
      .minLength(3)
      .regex(/^[a-zA-Z0-9-]+$/i),
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
