import { add } from 'date-fns'

import logger from './logger'
import prisma from './prisma'

const resetDB = async () => {
  await prisma.testResult.deleteMany()
  await prisma.courseEnrollment.deleteMany()
  await prisma.test.deleteMany()
  await prisma.course.deleteMany()
  await prisma.token.deleteMany()
  await prisma.user.deleteMany()
}

const seed = async (withLogs: boolean = true) => {
  await resetDB()

  const drDoe = await prisma.user.create({
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
      enrollments: {
        create: {
          role: 'TEACHER',
          user: {
            connect: { email: drDoe.email },
          },
        },
      },
    },
    include: {
      tests: true,
      enrollments: {
        include: {
          user: true,
        },
      },
    },
  })

  const shakur = await prisma.user.create({
    data: {
      email: 'tupac.shakur@test.com',
      firstName: 'Tupac',
      lastName: 'Shakur',
      enrollments: {
        create: {
          role: 'STUDENT',
          course: {
            connect: { id: course.id },
          },
        },
      },
    },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  })

  const jada = await prisma.user.create({
    data: {
      email: 'jada.menace@test.com',
      firstName: 'Jada',
      lastName: 'Menace',
      enrollments: {
        create: {
          role: 'STUDENT',
          course: {
            connect: { id: course.id },
          },
        },
      },
    },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  })

  const testResults = [800, 950, 700]
  let counter = 0
  for (const test of course.tests) {
    await prisma.testResult.create({
      data: {
        grader: {
          connect: {
            email: drDoe.email,
          },
        },
        student: {
          connect: {
            email: shakur.email,
          },
        },
        test: {
          connect: {
            id: test.id,
          },
        },
        result: testResults[counter],
      },
    })

    counter++
  }

  const shakurAvg = await prisma.testResult.aggregate({
    where: {
      studentId: shakur.id,
    },
    _avg: {
      result: true,
    },
    _min: {
      result: true,
    },
    _max: {
      result: true,
    },
    _count: {
      result: true,
    },
  })

  if (withLogs) {
    logger.logger.info(drDoe, 'Dr Doe')
    logger.logger.info(course, 'course')
    logger.logger.info(shakur, 'Tupac Shakur')
    logger.logger.info(jada, 'Jada Menace')
    logger.logger.info(shakurAvg, "Tupac's results")
  }
}

export default seed
