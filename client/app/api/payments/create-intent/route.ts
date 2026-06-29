import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { z } from "zod"

const schema = z.object({
  amount: z.number().min(1),
  jobId: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { amount, jobId } = parsed.data

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe uses cents
    currency: "usd",
    metadata: {
      jobId,
      userId: session.user.id,
    },
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  })
}
