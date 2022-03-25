import app from './app'
import serverConfig from './config/server'
import prisma from './lib/prisma'

const { port, host } = serverConfig

const server = app.listen(port as number, host, () => {
  console.info(`Server listening on ${host}:${port}`)
})

process.on('unhandledRejection', async (err) => {
  console.error('UnhandledRejection: Shutting down...', err)
  await prisma.$disconnect()
  server.close(() => process.exit(1))
})

process.on('SIGTERM', async () => {
  console.info('SIGTERM received: Shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => console.info('Process terminated'))
})
