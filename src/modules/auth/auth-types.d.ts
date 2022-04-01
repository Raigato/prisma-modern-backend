import { Request } from 'express'
import { User } from '@prisma/client'

export type TokenPayload = {
  id: string
}

export interface AuthenticatedRequest extends Request {
  user?: User
}
