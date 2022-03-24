import prisma from './lib/prisma'
import { add } from 'date-fns'

const resetDB = async () => {
  await prisma.test.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()
}

const seed = async () => {
  await resetDB()

  const user = await prisma.user.create({
    data: {
      email: 'john.doe@test.com',
      firstName: 'John',
      lastName: 'Doe',
      social: {
        facebook: 'johndoe',
        twitter: 'johndoe',
      },
    },
  })

  const weekFromNow = add(new Date(), { days: 7 })
  const twoWeeksFromNow = add(new Date(), { days: 14 })
  const monthFromNow = add(new Date(), { days: 28 })

  const course = await prisma.course.create({
    data: {
      name: 'CRUD with Prisma in the real world',
      details: 'A soft introduction to CRUD with Prisma',
      tests: {
        create: [
          {
            name: 'First test',
            date: weekFromNow,
          },
          {
            name: 'Second test',
            date: twoWeeksFromNow,
          },
          {
            name: 'Final exam',
            date: monthFromNow,
          },
        ],
      },
    },
    include: {
      tests: true,
    },
  })

  console.log('user', user)
  console.log('course', course)
}

seed()
  .catch((e: Error) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
