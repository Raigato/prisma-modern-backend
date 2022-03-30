import { Request } from 'express'

import APIResponse from '../types/APIResponse'
import MESSAGE from '../constants/MESSAGE'
import STATUS from '../constants/STATUS'
import prisma from '../lib/prisma'
import formatZodError from '../utils/formatZodError'
import { CreateUserInput, UserIdParams } from '../validation/users.validation'

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

export const getSingleUserHandler = async (req: Request, res: APIResponse) => {
  try {
    var parsedParams = UserIdParams.parse(req.params)
  } catch (err) {
    const errors = formatZodError(err)

    return res
      .status(400)
      .json({ status: STATUS.FAIL, message: MESSAGE.INVALID_REQUEST, errors })
  }

  const { userId } = parsedParams

  const foundUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      social: true,
    },
  })

  if (!foundUser)
    return res
      .status(404)
      .json({ status: STATUS.FAIL, message: 'User not found' })

  return res.status(200).json({ status: STATUS.SUCCESS, data: foundUser })
}

export const deleteUserHandler = async (req: Request, res: APIResponse) => {
  try {
    var parsedParams = UserIdParams.parse(req.params)
  } catch (err) {
    const errors = formatZodError(err)

    return res
      .status(400)
      .json({ status: STATUS.FAIL, message: MESSAGE.INVALID_REQUEST, errors })
  }

  const { userId } = parsedParams

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })
  } catch {
    return res
      .status(404)
      .json({ status: STATUS.FAIL, message: 'User not found' })
  }

  return res.status(204).send()
}
