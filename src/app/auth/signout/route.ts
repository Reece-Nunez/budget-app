export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies }     from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

export async function POST() {
  // build a Supabase client that can read/write your auth cookies
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // this will clear the session on the server and remove the cookie
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // tell the client it worked
  return NextResponse.json({ success: true });
}
