import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  verifyPassword,
  signHex,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'

const HMAC_PAYLOAD = 'findin-admin-v1'

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }
  const pw = String(body?.password || '')
  if (!pw) {
    return NextResponse.json({ error: 'missing_password' }, { status: 400 })
  }
  const ok = await verifyPassword(pw)
  if (!ok) {
    await new Promise((r) => setTimeout(r, 250))
    return NextResponse.json({ error: 'wrong_password' }, { status: 401 })
  }
  const cookieValue = await signHex(HMAC_PAYLOAD)
  cookies().set(ADMIN_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })
  return NextResponse.json({ ok: true })
}
