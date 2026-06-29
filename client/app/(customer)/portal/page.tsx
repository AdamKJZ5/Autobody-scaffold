import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { JobCard } from "@/components/customer/JobCard"

export default async function PortalPage() {
  const session = await auth()

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
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
