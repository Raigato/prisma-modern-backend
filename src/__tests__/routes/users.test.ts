import supertest from 'supertest'

import app from '../../app'
import seed from '../../lib/seed'
import prisma from '../../lib/prisma'

describe('Users routes', () => {
  beforeAll(async () => {
    await prisma.$connect()
    await seed(false)
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create an user', async () => {
    const data = {
      email: 'gab@test.com',
      firstName: 'Gab',
      lastName: 'Test',
    }

    const response = await supertest(app).post('/api/users').send(data)

    expect(response.statusCode).toEqual(201)
  })
})
