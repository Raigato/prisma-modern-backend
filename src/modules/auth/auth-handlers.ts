import { Request } from 'express'
import { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } from 'http-status'

import formatZodError from '../../utils/formatZodError'
import APIResponse from '../../types/APIResponse'
import { LoginInput } from './auth-validation'
import STATUS from '../../constants/STATUS'
import MESSAGE from '../../constants/MESSAGE'
import { generateEmailToken } from './auth-utils'
import { add } from 'date-fns'
import { createEmailToken } from './auth-service'

const EMAIL_TOKEN_EXPIRATION_IN_MINUTES = 10

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
