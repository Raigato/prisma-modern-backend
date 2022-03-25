import { ZodError } from 'zod'

const formatZodError = (e: ZodError) => {
  return e.flatten().fieldErrors
}

export default formatZodError
