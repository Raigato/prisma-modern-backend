import express from 'express'
import STATUS from './constants/STATUS'
import APIResponse from './types/APIResponse'
import userRouter from './modules/users/users-routes'
import { appConfig } from './config'

const PREFIX = appConfig.prefix
const router = express.Router()

router.get('/healthz', (_, res: APIResponse) => {
  res.status(200).json({ status: STATUS.SUCCESS })
})

router.use(`${PREFIX}/users`, userRouter)

router.all('*', (_, res) => {
  res.status(404).json({ status: STATUS.FAIL, message: 'Route not found' })
})

export default router
