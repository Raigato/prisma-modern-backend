import supertest from 'supertest'

import app from '../app'
import STATUS from '../constants/STATUS'

describe('Server health endpoint', () => {
  it('should return a 200 with success status', async () => {
    const response = await supertest(app).get('/healthz')

    expect(response.status).toBe(200)
    expect(response.body.status).toBe(STATUS.SUCCESS)
  })
})
