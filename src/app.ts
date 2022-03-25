import express from 'express'

const app = express()

app.use(express.json())

app.get('/healthz', (_, res) => {
  res.send('OK')
})

export default app
