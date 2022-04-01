import prisma from '../../lib/prisma'

import { CreateUserBody } from './users-validation'

export const createUser = (data: CreateUserBody) => prisma.user.create({ data })

export const findUserById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      social: true,
    },
  })

export const deleteUser = (id: string) =>
  prisma.user.delete({
    where: {
      id,
    },
  })
