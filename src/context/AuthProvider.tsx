'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supaBaseClient'
import type { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type AuthContextType = { user: User | null; session: Session | null }

const AuthContext = createContext<AuthContextType>({ user: null, session: null })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const initialEventFired = useRef(false)

  useEffect(() => {
    // fetch initial session/user
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
    })

    // single listener for both state & seeding payments
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (!initialEventFired.current) {
          initialEventFired.current = true
          return
        }

        if (event === 'SIGNED_IN' && session?.user) {
          // upsert only on conflict(user_id) so we don't stomp has_paid=true
          await supabase
            .from('payments')
            .upsert(
              [{
                user_id: session.user.id,
                email: session.user.email!,
                has_paid: false,
              }],
              { onConflict: 'user_id' }
            )
          router.push('/dashboard')
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, session }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
