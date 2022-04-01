import { Request, NextFunction } from 'express'
// import { UNAUTHORIZED } from 'http-status'

// import MESSAGE from '../../constants/MESSAGE'
// import STATUS from '../../constants/STATUS'
import APIResponse from '../../types/APIResponse'
// import { decodeJWT } from './auth-utils'

const guard = () => (_req: Request, _res: APIResponse, next: NextFunction) => {
  //   try {
  //     const token = decodeJWT(req)
  //   } catch {
  //     return res
  //       .status(UNAUTHORIZED)
  //       .json({ status: STATUS.FAIL, message: MESSAGE.UNAUTHORIZED })
  //   }

  return next()
}

export default guard
