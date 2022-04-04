import { NextFunction } from 'express'
import { UNAUTHORIZED } from 'http-status'

import MESSAGE from '../../constants/MESSAGE'
import STATUS from '../../constants/STATUS'
import APIResponse from '../../types/APIResponse'
import { fetchTokenWithUser } from './auth-service'
import { AuthenticatedRequest, TokenPayload } from './auth-types'
import { decodeJWT } from './auth-utils'

const guard =
  () =>
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

      req.user = fetchedToken.user
    } catch {
      return res
        .status(UNAUTHORIZED)
        .json({ status: STATUS.FAIL, message: MESSAGE.UNAUTHORIZED })
    }

    return next()
  }

export default guard
