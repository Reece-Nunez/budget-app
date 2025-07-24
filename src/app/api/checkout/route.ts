// src/app/api/checkout/route.ts
export const runtime = 'nodejs';

import { NextResponse }      from 'next/server';
import { cookies }           from 'next/headers';
import { createRouteHandlerClient }
  from '@supabase/auth-helpers-nextjs';
import Stripe                from 'stripe';
import type { Database }     from '@/lib/database.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST() {
  // ────────────────────────────────
  // 🆕 1) call cookies() inside the handler:
  const cookieStore = cookies();
  // 🆕 2) wrap it in a function for Supabase:
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  });
  // ────────────────────────────────

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/payment`,
      metadata: { user_id: userId },
      client_reference_id: userId,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    console.error('Stripe session creation failed:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
