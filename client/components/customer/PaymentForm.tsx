"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe-client"

function CheckoutForm({ jobId }: { jobId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError("")

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/portal`,
      },
    })

    if (stripeError) {
      setError(stripeError.message || "Payment failed")
      setLoading(false)
    }
  }

  if (success) {
    return <p className="text-green-600 font-medium">Payment successful!</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  )
}

export function PaymentForm({
  amount,
  jobId,
  clientSecret,
}: {
  amount: number
  jobId: string
  clientSecret: string
}) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm jobId={jobId} />
    </Elements>
  )
}
