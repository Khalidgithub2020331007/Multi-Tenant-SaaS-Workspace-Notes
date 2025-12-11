import vine from '@vinejs/vine'

export const companyRegisterValidator = vine.compile(
  vine.object({
    company_name: vine
      .string()
      .minLength(2)
      .escape()
      .regex(/^[a-zA-Z0-9\s]+$/), // শুধু অক্ষর, সংখ্যা এবং স্পেস

    hostname: vine
      .string()
      .minLength(3)
      .regex(/^[a-zA-Z0-9-]+$/i),

    owner_name: vine
      .string()
      .minLength(2)
      .regex(/^[a-zA-Z\s]+$/), // শুধু অক্ষর এবং স্পেস

    owner_email: vine.string().email(),

    owner_password: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  })
)
