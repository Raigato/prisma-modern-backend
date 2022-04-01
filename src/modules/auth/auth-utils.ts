import { Request } from 'express'
import jwt from 'jsonwebtoken'

import { appConfig } from '../../config'

const { secret, algorithm } = appConfig.jwt

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

  jwt.verify(token, secret as string, (err, decodedToken) => {
    if (err) throw new Error(JWT_ERROR.BAD_TOKEN)

    return decodedToken
  })

  return jwt.decode(token)
}

export const generateEmailToken = (): string =>
  Math.floor(10_000_000 + Math.random() * 90_000_000).toString()

export const generateAPIToken = (id: string): string => {
  const payload = { id }

  return jwt.sign(payload, secret, {
    algorithm: algorithm as jwt.Algorithm,
  })
}
