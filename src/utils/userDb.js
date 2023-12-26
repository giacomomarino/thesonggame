import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function addUser(name, email, imgURL) {
  await prisma.player.create({
    data: {
      name: name,
      email: email,
      img: imgURL
    },
  }).then(async () => {
    await prisma.$disconnect()
    console.log('User added')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
}


export async function fetchUser(email) {
    const user = await prisma.player.findFirst({
      where: {
        email: email
      },
    }).then(async () => {
      await prisma.$disconnect()
      return user
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
  }