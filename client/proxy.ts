import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const ADMIN_ROLES = ["TECHNICIAN", "FRONT_DESK", "MANAGER", "OWNER"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role as string | undefined

  const isPortalRoute = pathname.startsWith("/portal")
  const isAdminRoute =
    pathname.startsWith("/admin") && pathname !== "/admin/login"

  // Portal — must be logged in as any user
  if (isPortalRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Admin — must be logged in AND have a staff role
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  if (isAdminRoute && isLoggedIn && !ADMIN_ROLES.includes(userRole ?? "")) {
    return NextResponse.redirect(new URL("/portal", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
}
