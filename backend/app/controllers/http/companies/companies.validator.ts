import vine from '@vinejs/vine'

export const companyRegisterValidator = vine.compile(
  vine.object({
    company_name: vine.string().minLength(2),
    hostname: vine.string().minLength(3),
    owner_name: vine.string().minLength(2),
    owner_email: vine.string().email(),

    owner_password: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  })
)
