import { z } from 'zod'

export const LoginInput = z.object({
  email: z.string().email(),
})

export const AuthenticateInput = z.object({
  email: z.string().email(),
  emailToken: z.string().min(8).max(8),
})
