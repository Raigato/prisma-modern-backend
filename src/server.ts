import app from './app'
import serverConfig from './config/server'

const { port, host } = serverConfig

const server = app.listen(port as number, host, () => {
  console.info(`Server listening on ${host}:${port}`)
})

process.on('unhandledRejection', (err) => {
  console.error('UnhandledRejection: Shutting down...', err)
  server.close(() => process.exit(1))
})

process.on('SIGTERM', () => {
  console.info('SIGTERM received: Shutting down gracefully')
  server.close(() => console.info('Process terminated'))
})
