import { Request, Response } from 'express'
import { z } from 'zod'

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

export const createUserHandler = async (req: Request, res: Response) => {
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
    console.error(
      '[src/controllers/users.controllers.ts#createUserHandler]',
      err
    )

    return res
      .status(500)
      .json({ status: STATUS.ERROR, message: MESSAGE.EROOR_HAS_OCCURED })
  }

  return res
    .status(201)
    .json({ status: STATUS.SUCCESS, data: { id: createdUser.id } })
}
