import { NextFunction } from 'express'
import { UNAUTHORIZED } from 'http-status'
import { User } from '@prisma/client'

import MESSAGE from '../../constants/MESSAGE'
import STATUS from '../../constants/STATUS'
import APIResponse from '../../types/APIResponse'
import { fetchTokenWithUser } from './auth-service'
import { AuthenticatedRequest, Role, TokenPayload } from './auth-types'
import { decodeJWT } from './auth-utils'

const guard =
  (role: Role = 'user', ...checks: Array<(user: User) => boolean>) =>
  async (req: AuthenticatedRequest, res: APIResponse, next: NextFunction) => {
    try {
      const token = decodeJWT(req) as TokenPayload

      const fetchedToken = await fetchTokenWithUser(token.id)

      if (!fetchedToken || !fetchedToken.valid) {
        return res
          .status(UNAUTHORIZED)
          .json({ status: STATUS.FAIL, message: 'Invalid Token' })
      }

      if (fetchedToken.expiration < new Date()) {
        return res
          .status(UNAUTHORIZED)
          .json({ status: STATUS.FAIL, message: 'Expired Token' })
      }

      const { user } = fetchedToken

      if (role === 'admin' && !user.isAdmin) {
        return res
          .status(UNAUTHORIZED)
          .json({ status: STATUS.FAIL, message: MESSAGE.UNAUTHORIZED })
      }

      for (const check of checks) {
        if (!check(user)) {
          return res
            .status(UNAUTHORIZED)
            .json({ status: STATUS.FAIL, message: MESSAGE.UNAUTHORIZED })
        }
      }

      req.user = user
    } catch {
      return res
        .status(UNAUTHORIZED)
        .json({ status: STATUS.FAIL, message: MESSAGE.UNAUTHORIZED })
    }

    return next()
  }

export default guard
