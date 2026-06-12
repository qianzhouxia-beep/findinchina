/**
 * Admin auth — single password + HMAC-signed cookie.
 *
 * - ADMIN_PASSWORD: the plaintext password (set in Zeabur env, never in source)
 * - ADMIN_SECRET: HMAC signing key (set in Zeabur env; if absent, falls back to password)
 * - Cookie: httpOnly, sameSite=strict, 24h
 * - Verify: HMAC(secret, "findin-admin-v1") === cookie value
 *
 * Uses Web Crypto API (works in both Node and Edge runtimes).
 */

const COOKIE_NAME = 'admin_token'
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000 // 24h
const HMAC_PAYLOAD = 'findin-admin-v1'
const HMAC_SECRET_FALLBACK = 'no-secret-set'

function getPassword(): string {
  const p = process.env.ADMIN_PASSWORD
  if (!p) throw new Error('ADMIN_PASSWORD env not set')
  return p
}

function getSecret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || HMAC_SECRET_FALLBACK
}

async function signHex(payload: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  const arr = new Uint8Array(sig)
  let out = ''
  for (let i = 0; i < arr.length; i++) {
    out += arr[i].toString(16).padStart(2, '0')
  }
  return out
}

async function verifyPassword(input: string): Promise<boolean> {
  const expected = getPassword()
  if (input.length !== expected.length) {
    // Compare anyway (with padding) to consume time, return false
    let diff = 0
    const padded = input.padEnd(expected.length, '\0')
    for (let i = 0; i < padded.length; i++) {
      diff |= padded.charCodeAt(i) ^ expected.charCodeAt(i)
    }
    return false
  }
  let diff = 0
  for (let i = 0; i < input.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

async function verifyCookieValue(value: string | undefined | null): Promise<boolean> {
  if (!value) return false
  const expected = await signHex(HMAC_PAYLOAD)
  if (value.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < value.length; i++) {
    diff |= value.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME
export const ADMIN_COOKIE_MAX_AGE = COOKIE_MAX_AGE
export { verifyPassword, signHex, verifyCookieValue }
