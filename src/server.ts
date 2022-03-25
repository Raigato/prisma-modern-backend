import app from './app'
import serverConfig from './config/server'

const { port, host } = serverConfig

const start = () => {
  app.listen(port as number, host, () => {
    console.info(`Server listening on ${host}:${port}`)
  })

  return app
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

start()
