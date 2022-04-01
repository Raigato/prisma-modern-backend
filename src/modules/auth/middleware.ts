import { NextFunction } from 'express'
import { UNAUTHORIZED } from 'http-status'

import MESSAGE from '../../constants/MESSAGE'
import STATUS from '../../constants/STATUS'
import APIResponse from '../../types/APIResponse'
import { getTokenUser } from './auth-service'
import { AuthenticatedRequest, TokenPayload } from './auth-types'
import { decodeJWT } from './auth-utils'

const guard =
  () =>
  async (req: AuthenticatedRequest, res: APIResponse, next: NextFunction) => {
    try {
      const token = decodeJWT(req) as TokenPayload

      const user = await getTokenUser(token.id)

      req.user = user
    } catch {
      return res
        .status(UNAUTHORIZED)
        .json({ status: STATUS.FAIL, message: MESSAGE.UNAUTHORIZED })
    }

    return next()
  }

export default guard
