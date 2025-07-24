// app/api/webhook/route.ts
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 1) Disable Next’s body parser so we can validate the raw payload
export const config = {
  api: { bodyParser: false }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// This GET lets us confirm the route is live:
export async function GET() {
  console.log('[webhook] GET ping')
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  console.log('[webhook] 📬 POST received')

  const rawBody = await req.text()
  const sig     = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log('[webhook] ✓ signature verified, event type =', event.type)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('[webhook] ✗ signature verification failed:', errorMessage)
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('[webhook] checkout.session.completed payload:', session)

    const user_id = session.metadata?.user_id
    if (!user_id) {
      console.warn('[webhook] ⚠ no metadata.user_id on session—skipping upsert')
    } else {
      const { error } = await supabaseAdmin
        .from('payments')
        .upsert(
          [{ user_id, email: session.customer_email, has_paid: true }],
          { onConflict: 'user_id' }
        )
      if (error) console.error('[webhook] ✗ upsert error:', error)
      else       console.log('[webhook] ✅ marked user paid:', user_id)
    }
  } else {
    console.log('[webhook] ignoring event type:', event.type)
  }

  return new NextResponse('ok', { status: 200 })
}
