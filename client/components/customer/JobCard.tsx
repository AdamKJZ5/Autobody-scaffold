"use client"

import { useState } from "react"
import { PaymentForm } from "./PaymentForm"

type Job = {
  id: string
  vehicleYear: number
  vehicleMake: string
  vehicleModel: string
  vehicleVin: string | null
  status: string
  estimatedCompletion: Date | null
}

const STAGES = [
  "RECEIVED",
  "DISASSEMBLY",
  "PARTS_ORDERED",
  "BODY_WORK",
  "PAINT",
  "REASSEMBLY",
  "QUALITY_CHECK",
  "READY",
]

export function JobCard({ job }: { job: Job }) {
  const [clientSecret, setClientSecret] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(false)

  const currentIndex = STAGES.indexOf(job.status)

  async function handlePayClick() {
    setLoading(true)
    const res = await fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500, jobId: job.id }),
    })
    const data = await res.json()
    setClientSecret(data.clientSecret)
    setShowPayment(true)
    setLoading(false)
  }

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg">
            {job.vehicleYear} {job.vehicleMake} {job.vehicleModel}
          </h2>
          {job.vehicleVin && (
            <p className="text-sm text-gray-400">VIN: {job.vehicleVin}</p>
          )}
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {job.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-8 gap-1">
        {STAGES.map((stage, i) => (
          <div
            key={stage}
            className={`h-2 rounded-full ${i <= currentIndex ? "bg-blue-500" : "bg-gray-200"}`}
          />
        ))}
      </div>

      {job.estimatedCompletion && (
        <p className="mt-3 text-sm text-gray-500">
          Estimated completion:{" "}
          {new Date(job.estimatedCompletion).toLocaleDateString()}
        </p>
      )}

      <div className="mt-4">
        {!showPayment ? (
          <button
            onClick={handlePayClick}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            {loading ? "Loading..." : "Pay Balance"}
          </button>
        ) : clientSecret ? (
          <div className="mt-4">
            <h3 className="font-medium mb-3">Complete Payment</h3>
            <PaymentForm
              amount={500}
              jobId={job.id}
              clientSecret={clientSecret}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
