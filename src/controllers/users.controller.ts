import { Request } from 'express'
import { z } from 'zod'

import APIResponse from '../types/APIResponse'
import MESSAGE from '../constants/MESSAGE'
import STATUS from '../constants/STATUS'
import prisma from '../lib/prisma'
import formatZodError from '../utils/formatZodError'

const Social = z.string().optional()

const CreateUserInput = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  social: z
    .object({
      facebook: Social,
      twitter: Social,
      instagram: Social,
      tiktok: Social,
      github: Social,
      website: z.string().url().optional(),
    })
    .optional(),
})

export const createUserHandler = async (req: Request, res: APIResponse) => {
  try {
    var parsedBody = CreateUserInput.parse(req.body)
  } catch (err) {
    const errors = formatZodError(err)

    return res
      .status(400)
      .json({ status: STATUS.FAIL, message: MESSAGE.INVALID_REQUEST, errors })
  }

  const { email, firstName, lastName, social } = parsedBody

  try {
    var createdUser = await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        social: social,
      },
    })
  } catch (err) {
    req.log.error(
      { err },
      '[src/controllers/users.controllers.ts#createUserHandler]'
    )

    return res
      .status(500)
      .json({ status: STATUS.ERROR, message: MESSAGE.ERROR_HAS_OCCURED })
  }

  return res
    .status(201)
    .json({ status: STATUS.SUCCESS, data: { id: createdUser.id } })
}

const GetSingleUserParams = z.object({
  userId: z.string().uuid(),
})

export const getSingleUserHandler = async (req: Request, res: APIResponse) => {
  try {
    var parsedParams = GetSingleUserParams.parse(req.params)
  } catch (err) {
    const errors = formatZodError(err)

    return res
      .status(400)
      .json({ status: STATUS.FAIL, message: MESSAGE.INVALID_REQUEST, errors })
  }

  const { userId } = parsedParams

  const foundUser = await prisma.user.findUnique({ where: { id: userId } })

  if (!foundUser)
    return res
      .status(404)
      .json({ status: STATUS.FAIL, message: 'User not found' })

  return res.status(200).json({ status: STATUS.SUCCESS, data: foundUser })
}
