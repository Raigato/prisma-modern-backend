import express from 'express'

const router = express.Router()

router.get('/healthz', (_, res) => {
  res.send('OK')
})

router.all('*', (_, res) => {
  res.status(404).json({ message: 'Route not found' })
})

export default router
