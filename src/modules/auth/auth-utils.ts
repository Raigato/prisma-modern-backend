import { Request } from 'express'
import jwt from 'jsonwebtoken'

import { appConfig } from '../../config'

const SECRET = appConfig.jwt.secret

export enum JWT_ERROR {
  NONE_FOUND = 'No token found',
  BAD_TOKEN = 'Bad Token',
}

const extractBearerToken = (authorization: string | undefined) => {
  if (typeof authorization !== 'string') return false

  const matches = authorization.match(/(bearer)\s+(\S+)/i)
  return matches && matches[2]
}

export const decodeJWT = (req: Request) => {
  const { authorization } = req.headers

  const token = extractBearerToken(authorization)

  if (!token) throw new Error(JWT_ERROR.NONE_FOUND)

  return jwt.verify(token, SECRET as string, (err, decodedToken) => {
    if (err) throw new Error(JWT_ERROR.BAD_TOKEN)

    return decodedToken
  })
}

export const generateEmailToken = (): string =>
  Math.floor(10_000_000 + Math.random() * 90_000_000).toString()
