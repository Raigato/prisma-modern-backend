import supertest from 'supertest'

import app from '../../app'
import seed from '../../lib/seed'
import prisma from '../../lib/prisma'
import { appConfig } from '../../config'

const PREFIX = appConfig.prefix

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
    it('should returns a 201 with an user id', async () => {
      const data = {
        email: 'gab@test.com',
        firstName: 'Gab',
        lastName: 'Test',
      }

      const response = await supertest(app).post(`${PREFIX}/users`).send(data)

      expect(response.statusCode).toEqual(201)

      expect(response.body.data.id).toBeTruthy()

      userId = response.body.data.id
    })

    it('should fail with invalid input', async () => {
      const data = {
        email: 'gab@test.com',
      }

      const response = await supertest(app).post(`${PREFIX}/users`).send(data)

      expect(response.statusCode).toEqual(400)
    })
  })

  describe('get single user', () => {
    it('should return a 200 and the right user', async () => {
      const data = {
        email: 'singleUser@test.com',
        firstName: 'Single',
        lastName: 'User',
      }

      const user = await prisma.user.create({ data })

      const response = await supertest(app).get(`${PREFIX}/users/${user.id}`)

      expect(response.statusCode).toEqual(200)

      const { id, isAdmin, ...userData } = user

      expect(response.body.data).toEqual(userData)
    })

    it('should return a 404 if user is not found', async () => {
      const data = {
        email: 'notFoundUser@test.com',
        firstName: 'NotFound',
        lastName: 'User',
      }

      const user = await prisma.user.create({ data })

      const { id } = user

      await prisma.user.delete({ where: { id } })

      const response = await supertest(app).get(`${PREFIX}/users/${user.id}`)

      expect(response.statusCode).toEqual(404)
    })
  })

  describe('delete user', () => {
    it('should return 204 after deleting an user successfully', async () => {
      const response = await supertest(app).delete(`${PREFIX}/users/${userId}`)

      expect(response.statusCode).toEqual(204)
    })
  })
})
