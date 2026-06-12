import { prisma } from "../lib/db"

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@autobody.com",
      passwordHash: "placeholder",
      role: "CUSTOMER",
      customer: {
        create: {
          firstName: "Test",
          lastName: "Customer",
        },
      },
    },
  })

  console.log("Created user:", user)

  const allUsers = await prisma.user.findMany({ include: { customer: true } })
  console.log("All users:", allUsers)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
