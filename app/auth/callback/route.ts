import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

function getOrigin(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin
}

export async function GET(req: NextRequest) {
  const origin = getOrigin(req)
  const code = req.nextUrl.searchParams.get('code')

  if (code) {
    const supabase = await getSupabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, origin)
      )
    }
  }

  return NextResponse.redirect(new URL('/wo', origin))
}
