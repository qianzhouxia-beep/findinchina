'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface NewsletterFormProps {
  dark?: boolean
}

export function NewsletterForm({ dark = false }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Subscription failed')

      setStatus('success')
      setMessage('Check your inbox to confirm!')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div
        className={`flex items-center justify-center gap-2 ${
          dark ? 'text-white' : 'text-brand-600'
        }`}
      >
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-medium">{message}</span>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        disabled={status === 'loading'}
        className={`flex-1 px-4 py-3 rounded-md border ${
          dark
            ? 'bg-white/10 border-white/20 text-white placeholder-white/60'
            : 'bg-white border-gray-300 text-gray-900'
        } focus:outline-none focus:ring-2 focus:ring-brand-500`}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`px-6 py-3 rounded-md font-semibold transition ${
          dark
            ? 'bg-white text-brand-600 hover:bg-gray-100'
            : 'bg-brand-600 text-white hover:bg-brand-700'
        } disabled:opacity-50`}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-500 mt-2">{message}</p>
      )}
    </form>
  )
}