// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  // this reads incoming Supabase auth cookies and—and if you
  // land on a “?code=…” URL—will automatically exchange them
  // for a session and set the response cookies for you.
  const res = NextResponse.next()
  createMiddlewareSupabaseClient({ req, res })
  return res
}

// only run on your auth flow and dashboard routes
export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
}
