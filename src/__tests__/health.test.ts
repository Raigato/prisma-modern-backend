import supertest from 'supertest'

import app from '../app'

describe('Server status', () => {
  it('should return a 200', async () => {
    const response = await supertest(app).get('/healthz')

    expect(response.status).toBe(200)
  })
})
