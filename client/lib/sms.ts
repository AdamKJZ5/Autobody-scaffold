import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function sendSMS(to: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    })
    console.log("[sms] Sent:", result.sid)
    return { success: true, sid: result.sid }
  } catch (error) {
    console.error("[sms] Error:", error)
    return { success: false, error }
  }
}

export function formatJobStatusMessage(
  firstName: string,
  vehicleYear: number,
  vehicleMake: string,
  vehicleModel: string,
  status: string
) {
  const statusMap: Record<string, string> = {
    RECEIVED: "has been received at our shop",
    DISASSEMBLY: "is currently being disassembled for inspection",
    PARTS_ORDERED: "is waiting on parts",
    BODY_WORK: "is currently in body work",
    PAINT: "is currently in paint",
    REASSEMBLY: "is being reassembled",
    QUALITY_CHECK: "is going through final quality check",
    READY: "is ready for pickup!",
    DELIVERED: "has been delivered. Thank you for your business!",
  }

  const statusText = statusMap[status] || `status has been updated to ${status}`

  return `Hi ${firstName}, your ${vehicleYear} ${vehicleMake} ${vehicleModel} ${statusText}. Questions? Reply to this message.`
}
