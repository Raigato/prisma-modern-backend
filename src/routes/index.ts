import express from 'express'
import userRouter from './users.routes'
import STATUS from '../constants/STATUS'
import APIResponse from 'src/types/APIResponse'

const router = express.Router()

router.get('/healthz', (_, res: APIResponse) => {
  res.status(200).json({ status: STATUS.SUCCESS })
})

router.use('/api/users', userRouter)

router.all('*', (_, res) => {
  res.status(404).json({ status: STATUS.FAIL, message: 'Route not found' })
})

export default router
