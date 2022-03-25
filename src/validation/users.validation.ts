import { z } from 'zod'

const Social = z.string().optional()

export const CreateUserInput = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  social: z
    .object({
      facebook: Social,
      twitter: Social,
      instagram: Social,
      tiktok: Social,
      github: Social,
      website: z.string().url().optional(),
    })
    .optional(),
})

export const GetSingleUserParams = z.object({
  userId: z.string().uuid(),
})
