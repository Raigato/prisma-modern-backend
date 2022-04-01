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

export const fetchEmailToken = (emailToken: string) =>
  prisma.token.findUnique({
    where: {
      emailToken,
    },
    include: {
      user: true,
    },
  })

export const createToken = (email: string, expiration: Date) =>
  prisma.token.create({
    data: {
      type: 'API',
      expiration,
      user: {
        connect: {
          email,
        },
      },
    },
  })

export const invalidateToken = (id: string) =>
  prisma.token.update({
    where: { id },
    data: {
      valid: false,
    },
  })

export const getTokenUser = async (tokenId: string) => {
  const token = await prisma.token.findUnique({
    where: {
      id: tokenId,
    },
    include: {
      user: true,
    },
  })

  return token?.user
}
