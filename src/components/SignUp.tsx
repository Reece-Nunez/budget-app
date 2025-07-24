'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supaBaseClient'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function Signup({ toggle }: { toggle: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    if (!email.includes('@')) return toast.error('Please enter a valid email address.')
    if (password.length < 6) return toast.error('Password must be at least 6 characters.')

    // 1) Create the user
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      return toast.error(signUpError.message)
    }

    // 2) Seed the payments table
    //    `data.user` should exist immediately after signUp
    if (data.user) {
      const { error: seedError } =
        await supabase
          .from('payments')
          .upsert(
            [{
              user_id: data.user.id,
              email: data.user.email!,
              has_paid: false,
            }],
            { onConflict: 'user_id' }
          )

      if (seedError) console.error('❌ failed to seed payments:', seedError)
    }

    toast.success('Account created! Check your email to verify.')
  }

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast('Redirecting to Google…')
    }
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto mt-12 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold text-center">Create an Account</h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        onClick={handleSignup}
      >
        Sign Up with Email
      </button>

      <hr className="my-4" />

      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        onClick={handleGoogleSignup}
      >
        Sign Up with Google
      </button>

      <p className="text-sm text-center mt-2">
        Already have an account?{' '}
        <button className="text-blue-600 underline" onClick={toggle}>
          Log in here
        </button>
      </p>
    </div>
  )
}
