'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supaBaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        toast.success('Logged in via Google!')
        router.push('/dashboard')
      } else {
        toast.error('Login failed. Please try again.')
        router.push('/auth')
      }
    }

    checkSession()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-center text-sm text-muted-foreground">Processing login...</p>
    </div>
  )
}
