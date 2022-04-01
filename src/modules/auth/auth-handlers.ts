import { Request } from 'express'
import {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
  UNAUTHORIZED,
} from 'http-status'

import formatZodError from '../../utils/formatZodError'
import APIResponse from '../../types/APIResponse'
import { AuthenticateInput, LoginInput } from './auth-validation'
import STATUS from '../../constants/STATUS'
import MESSAGE from '../../constants/MESSAGE'
import { generateAPIToken, generateEmailToken } from './auth-utils'
import { add } from 'date-fns'
import {
  createEmailToken,
  createToken,
  fetchEmailToken,
  invalidateToken,
} from './auth-service'

const EMAIL_TOKEN_EXPIRATION_IN_MINUTES = 10
const AUTHENTICATION_TOKEN_EXPIRATION_IN_HOURS = 12

export const loginHandler = async (req: Request, res: APIResponse) => {
  try {
    var parsedBody = LoginInput.parse(req.body)
  } catch (err) {
    const errors = formatZodError(err)

    return res
      .status(BAD_REQUEST)
      .json({ status: STATUS.FAIL, message: MESSAGE.INVALID_REQUEST, errors })
  }

  const emailToken = generateEmailToken()
  const tokenExpiration = add(new Date(), {
    minutes: EMAIL_TOKEN_EXPIRATION_IN_MINUTES,
  })

  try {
    await createEmailToken(parsedBody.email, emailToken, tokenExpiration)
  } catch (err) {
    req.log.error({ err }, '[src/modules/auth/auth-handlers#loginHandler]')
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ status: STATUS.ERROR, message: MESSAGE.ERROR_HAS_OCCURED })
  }

  return res.status(OK).json({
    status: STATUS.SUCCESS,
    data: {
      token: emailToken,
    },
  })
}

export const authenticateHandler = async (req: Request, res: APIResponse) => {
  try {
    var parsedBody = AuthenticateInput.parse(req.body)
  } catch (err) {
    const errors = formatZodError(err)

    return res
      .status(BAD_REQUEST)
      .json({ status: STATUS.FAIL, message: MESSAGE.INVALID_REQUEST, errors })
  }

  const { email, emailToken } = parsedBody

  try {
    const fetchedEmailToken = await fetchEmailToken(emailToken)

    if (
      !fetchedEmailToken ||
      !fetchedEmailToken.valid ||
      fetchedEmailToken.user.email !== email
    ) {
      return res
        .status(UNAUTHORIZED)
        .json({ status: STATUS.FAIL, message: 'Invalid token' })
    }

    if (fetchedEmailToken.expiration < new Date()) {
      return res
        .status(UNAUTHORIZED)
        .json({ status: STATUS.FAIL, message: 'Expired token' })
    }

    const tokenExpiration = add(new Date(), {
      hours: AUTHENTICATION_TOKEN_EXPIRATION_IN_HOURS,
    })

    const createdToken = await createToken(email, tokenExpiration)

    await invalidateToken(fetchedEmailToken.id)

    const authToken = generateAPIToken(createdToken.id)

    return res.status(OK).header('Authorization', authToken).send()
  } catch (err) {
    req.log.error(
      { err },
      '[src/modules/auth/auth-handlers#authenticateHandler]'
    )
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ status: STATUS.ERROR, message: MESSAGE.ERROR_HAS_OCCURED })
  }
}
