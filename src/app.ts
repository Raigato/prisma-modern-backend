import express from 'express'
import dotenv from 'dotenv-flow'

import logger from './lib/logger'
import router from './router'

dotenv.config()

const app = express()

app.use(logger)
app.use(express.json())

app.use(router)

export default app
