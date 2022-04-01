import prisma from '../../lib/prisma'

export const createEmailToken = (
  email: string,
  emailToken: string,
  expiration: Date
) =>
  prisma.token.create({
    data: {
      emailToken,
      expiration,
      type: 'EMAIL',
      user: {
        connectOrCreate: {
          create: { email },
          where: { email },
        },
      },
    },
  })
