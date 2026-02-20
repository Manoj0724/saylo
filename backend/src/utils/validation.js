import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const validate = (schema, body) => {
  const result = schema.safeParse(body)
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path[0],
      message: e.message,
    }))
    return { valid: false, errors }
  }
  return { valid: true, data: result.data }
}