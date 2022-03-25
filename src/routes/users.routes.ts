import express from 'express'

import { createUserHandler } from './../controllers/users.controller'

const userRouter = express.Router()

userRouter.post('/', createUserHandler)

export default userRouter
