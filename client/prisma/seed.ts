import { prisma } from "../lib/db"
import bcrypt from "bcryptjs"

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12)

  const user = await prisma.user.upsert({
    where: { email: "test@autobody.com" },
    update: { passwordHash },
    create: {
      email: "test@autobody.com",
      passwordHash,
      role: "CUSTOMER",
      customer: {
        create: {
          firstName: "Test",
          lastName: "Customer",
        },
      },
    },
  })

  console.log("Seeded user:", user.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
