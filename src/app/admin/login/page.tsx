'use client'
import { Suspense, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') || '/admin'
  const [pw, setPw] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [pending, start] = useTransition()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    if (r.ok) {
      router.replace(from)
      router.refresh()
    } else {
      const j = await r.json().catch(() => ({}))
      setErr(j.error === 'wrong_password' ? 'Wrong password' : 'Login failed')
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-8 shadow-sm"
    >
      <div className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest mb-2">
        FindInChina
      </div>
      <h1 className="font-serif text-2xl font-bold mb-1">Admin sign in</h1>
      <p className="text-sm text-slate-500 mb-6">One password. Twenty-four hours.</p>

      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">
        Password
      </label>
      <input
        type="password"
        autoFocus
        required
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="w-full border border-slate-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />

      {err && <div className="text-sm text-red-600 mb-3">{err}</div>}

      <button
        type="submit"
        disabled={pending || !pw}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded px-4 py-2 disabled:opacity-50"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-4">
      <Suspense fallback={<div className="text-slate-500">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
