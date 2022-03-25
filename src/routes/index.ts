import express from 'express'
import userRouter from './users.routes'
import STATUS from '../constants/STATUS'

const router = express.Router()

router.get('/healthz', (_, res) => {
  res.send('OK')
})

router.use('/api/users', userRouter)

router.all('*', (_, res) => {
  res.status(404).json({ status: STATUS.FAIL, message: 'Route not found' })
})

export default router
