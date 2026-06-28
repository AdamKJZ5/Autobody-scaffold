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
    include: { customer: true },
  })

  console.log("Seeded user:", user.email)

  const customer = user.customer!

  await prisma.job.upsert({
    where: { id: "test-job-001" },
    update: {},
    create: {
      id: "test-job-001",
      customerId: customer.id,
      status: "BODY_WORK",
      vehicleYear: 2019,
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
      vehicleVin: "1HGBH41JXMN109186",
      estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  console.log("Seeded test job for customer")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
