import prisma from './lib/prisma'
import logger from './lib/logger'
import seed from './lib/seed'

seed()
  .catch((e: Error) => {
    logger.logger.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
