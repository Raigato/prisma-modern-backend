const appConfig = {
  prefix: '/api/v1',
  jwt: {
    secret: process.env.JWT_SECRET,
    algorithm: 'HS256',
  },
}

export default appConfig
