import { Request, Response, NextFunction } from 'express'

const guard = () => (_req: Request, _res: Response, next: NextFunction) => {
  return next()
}

export default guard
