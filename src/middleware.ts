/**
 * Edge middleware: guard /admin/* paths.
 * Runs at the edge before page render. Verifies HMAC-signed cookie using
 * Web Crypto API (Edge runtime has no Node `crypto`).
 */
import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_NAME = 'admin_token'
const HMAC_PAYLOAD = 'findin-admin-v1'
const HMAC_SECRET_FALLBACK = 'no-secret-set'

function getSecret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || HMAC_SECRET_FALLBACK
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    out[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return out
}

function bytesToHex(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes)
  let out = ''
  for (let i = 0; i < arr.length; i++) {
    out += arr[i].toString(16).padStart(2, '0')
  }
  return out
}

async function signHex(payload: string): Promise<string> {
  const enc = new TextEncoder()
  const keyMaterial = enc.encode(getSecret())
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(payload))
  return bytesToHex(sig)
}

async function verifyCookieValue(value: string | undefined | null): Promise<boolean> {
  if (!value) return false
  const expected = await signHex(HMAC_PAYLOAD)
  if (value.length !== expected.length) return false
  // constant-time compare on hex strings
  let diff = 0
  for (let i = 0; i < value.length; i++) {
    diff |= value.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow login page + login/logout API + static
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/login') ||
    pathname.startsWith('/api/admin/logout') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/brands/') ||
    pathname.startsWith('/findinchina')
  ) {
    return NextResponse.next()
  }

  // Guard /admin/* and /api/admin/* other than login/logout
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const cookie = req.cookies.get(COOKIE_NAME)?.value
    if (await verifyCookieValue(cookie)) {
      return NextResponse.next()
    }
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
