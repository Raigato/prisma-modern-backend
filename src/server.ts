import app from './app'
import serverConfig from './config/server'
import logger from './lib/logger'
import prisma from './lib/prisma'

const { port, host } = serverConfig

const server = app.listen(port as number, host, () => {
  logger.logger.info(`Server listening on ${host}:${port}`)
})

process.on('unhandledRejection', async (err) => {
  logger.logger.error('UnhandledRejection: Shutting down...', err)
  await prisma.$disconnect()
  server.close(() => process.exit(1))
})

process.on('SIGTERM', async () => {
  logger.logger.info('SIGTERM received: Shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => logger.logger.info('Process terminated'))
})
