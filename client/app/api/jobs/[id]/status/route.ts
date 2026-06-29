import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { sendSMS, formatJobStatusMessage } from "@/lib/sms"
import { z } from "zod"

const ADMIN_ROLES = ["TECHNICIAN", "FRONT_DESK", "MANAGER", "OWNER"]

const schema = z.object({
  status: z.enum([
    "RECEIVED",
    "DISASSEMBLY",
    "PARTS_ORDERED",
    "BODY_WORK",
    "PAINT",
    "REASSEMBLY",
    "QUALITY_CHECK",
    "READY",
    "DELIVERED",
  ]),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const job = await prisma.job.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
    include: {
      customer: {
        include: { user: true },
      },
    },
  })

  // Send SMS if customer has a phone number
  if (job.customer.user.phone) {
    const message = formatJobStatusMessage(
      job.customer.firstName,
      job.vehicleYear,
      job.vehicleMake,
      job.vehicleModel,
      job.status
    )
    await sendSMS(job.customer.user.phone, message)
  }

  return NextResponse.json({ job })
}
