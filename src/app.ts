import express from 'express'

import logger from './lib/logger'
import router from './router'

const app = express()

app.use(logger)
app.use(express.json())

app.use(router)

export default app
