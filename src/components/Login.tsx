'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supaBaseClient'
import { toast } from 'sonner'

export default function Login({ toggle }: { toggle: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email.includes('@')) return toast.error('Invalid email')
    if (password.length < 6) return toast.error('Password too short')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged in successfully!')
    }
  }

  const handleGoogleLogin = async () => {
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
      <h2 className="text-xl font-semibold text-center">Login</h2>

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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleLogin}
      >
        Log In with Email
      </button>

      <hr className="my-4" />

      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        onClick={handleGoogleLogin}
      >
        Log In with Google
      </button>

      <p className="text-sm text-center mt-2">
        Don’t have an account?{' '}
        <button className="text-green-600 underline" onClick={toggle}>
          Sign up here
        </button>
      </p>
    </div>
  )
}
