import express from 'express'

import {
  createUserHandler,
  getSingleUserHandler,
} from './../controllers/users.controller'

const userRouter = express.Router()

userRouter.post('/', createUserHandler)
userRouter.get('/:userId', getSingleUserHandler)

export default userRouter
