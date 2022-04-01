import express from 'express'

import {
  createUserHandler,
  deleteUserHandler,
  getSingleUserHandler,
} from './users-controller'

const userRouter = express.Router()

userRouter.post('/', createUserHandler)
userRouter.get('/:userId', getSingleUserHandler)
userRouter.delete('/:userId', deleteUserHandler)

export default userRouter
