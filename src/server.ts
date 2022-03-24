import app from './app'
import prisma from './lib/prisma'

app()
  .catch((e: Error) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
