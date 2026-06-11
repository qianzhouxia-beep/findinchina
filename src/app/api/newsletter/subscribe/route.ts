import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('subscribers')
      .insert({
        email,
        source: source || 'homepage',
        status: 'active',
      })

    if (dbError && !dbError.message.includes('duplicate')) {
      throw dbError
    }

    // Sync to Beehiiv (if API key configured)
    if (process.env.BEEHIIV_API_KEY) {
      try {
        await fetch(
          `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
            },
            body: JSON.stringify({
              email,
              reactivate_existing: true,
              send_welcome_email: true,
            }),
          }
        )
      } catch (e) {
        console.error('Beehiiv sync failed:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter subscribe error:', err)
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }
}