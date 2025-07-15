'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supaBaseClient'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')

  const handleReset = async () => {
    if (!email.includes('@')) return toast.error('Enter a valid email')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset email sent!')
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto mt-12 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold text-center">Reset Password</h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleReset}
      >
        Send Reset Link
      </button>
    </div>
  )
}
