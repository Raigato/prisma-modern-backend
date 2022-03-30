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

  describe('create user', () => {
    it('should create returns a 201 with an user id', async () => {
      const data = {
        email: 'gab@test.com',
        firstName: 'Gab',
        lastName: 'Test',
      }

      const response = await supertest(app).post('/api/users').send(data)

      expect(response.statusCode).toEqual(201)

      expect(response.body.data.id).toBeTruthy()
    })

    it('should fail with invalid input', async () => {
      const data = {
        email: 'gab@test.com',
      }

      const response = await supertest(app).post('/api/users').send(data)

      expect(response.statusCode).toEqual(400)
    })
  })
})
