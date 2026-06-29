import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"

export default async function PortalPage() {
  const session = await auth()
  console.log("[portal] session user:", session?.user)

  if (!session?.user) {
    redirect("/login")
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
    redirect("/login")
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">
        Welcome back, {customer.firstName}
      </h1>
      <p className="text-gray-500 mb-8">Here are your active repairs</p>

      {customer.jobs.length === 0 ? (
        <p className="text-gray-400">No repairs on file yet.</p>
      ) : (
        <div className="space-y-4">
          {customer.jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-6 bg-white shadow-sm">
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
                {[
                  "RECEIVED",
                  "DISASSEMBLY",
                  "PARTS_ORDERED",
                  "BODY_WORK",
                  "PAINT",
                  "REASSEMBLY",
                  "QUALITY_CHECK",
                  "READY",
                ].map((stage, i, arr) => {
                  const currentIndex = arr.indexOf(job.status)
                  const isDone = i <= currentIndex
                  return (
                    <div
                      key={stage}
                      className={`h-2 rounded-full ${isDone ? "bg-blue-500" : "bg-gray-200"}`}
                    />
                  )
                })}
              </div>

              {job.estimatedCompletion && (
                <p className="mt-3 text-sm text-gray-500">
                  Estimated completion:{" "}
                  {new Date(job.estimatedCompletion).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
