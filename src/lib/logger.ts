import pinoHttp from 'pino-http'

const logger = pinoHttp({
  enabled: process.env.NODE_ENV !== 'test',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

export default logger
