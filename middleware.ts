import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])
const isAuthRoute = createRouteMatcher(["/auth(.*)"])

// Routes that require an active paid subscription
const isPremiumRoute = createRouteMatcher([
  "/dashboard/analytics(.*)",
  "/dashboard/team(.*)",
  "/dashboard/settings/integrations(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  // Protect all dashboard routes — require sign-in first
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // For premium-only routes, verify subscription status via internal API
  if (isPremiumRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }

    // Check subscription from DB via internal API
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
    try {
      const res = await fetch(`${appUrl}/api/subscription/status?userId=${userId}`)
      const data = await res.json()

      if (!data.active) {
        return NextResponse.redirect(new URL("/pricing?upgrade=true", req.url))
      }
    } catch {
      // If subscription check fails, allow through (fail-open)
      // For stricter security, redirect to /pricing instead
    }
  }
})

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}
