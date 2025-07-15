'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supaBaseClient'
import { toast } from 'sonner'

export default function Signup({ toggle }: { toggle: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    if (!email.includes('@')) {
      return toast.error('Please enter a valid email address.')
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters.')
    }

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Check your email to verify.')
    }
  }

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast('Redirecting to Google...')
    }
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
