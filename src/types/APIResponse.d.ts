import { Response } from 'express'
import { ZodFormattedError } from 'zod'

type APIResponseBody = {
  status: STATUS
  message?: string
  errors?: ZodFormattedError
  data?: any
}

type APIResponse = Response<APIResponseBody>

export default APIResponse
