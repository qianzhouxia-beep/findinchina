'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const [pending, start] = useTransition()
  function logout() {
    start(async () => {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.replace('/admin/login')
      router.refresh()
    })
  }
  return (
    <button
      onClick={logout}
      disabled={pending}
      className="text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50"
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
