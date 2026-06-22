import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  const isAdminRoute = pathname.startsWith("/admin")
  const isPortalRoute = pathname.startsWith("/portal")

  if (isPortalRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
}
