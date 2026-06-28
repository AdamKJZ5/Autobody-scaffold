import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
    include: {
      jobs: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 })
  }

  return NextResponse.json({ jobs: customer.jobs })
}
