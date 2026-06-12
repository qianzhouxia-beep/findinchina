import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST() {
  cookies().set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
  return NextResponse.json({ ok: true })
}
