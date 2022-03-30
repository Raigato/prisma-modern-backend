import supertest from 'supertest'

import app from '../../app'
import seed from '../../lib/seed'
import prisma from '../../lib/prisma'

var userId: string

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

      userId = response.body.data.id
    })

    it('should fail with invalid input', async () => {
      const data = {
        email: 'gab@test.com',
      }

      const response = await supertest(app).post('/api/users').send(data)

      expect(response.statusCode).toEqual(400)
    })
  })

  describe('delete user', () => {
    it('should delete an user successfully', async () => {
      const response = await supertest(app).delete(`/api/users/${userId}`)

      expect(response.statusCode).toEqual(204)
    })
  })
})
