import prisma from './lib/prisma'

const seed = async () => {}

seed()
  .catch((e: Error) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
