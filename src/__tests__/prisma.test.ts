import seed from '../lib/seed'
import prisma from '../lib/prisma'

describe('Prisma client test', () => {
  beforeAll(async () => {
    await prisma.$connect()
    await seed(false)
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should return a value', async () => {
    const data = await prisma.user.findMany({ take: 1, select: { id: true } })

    expect(data).toBeTruthy()
  })
})
