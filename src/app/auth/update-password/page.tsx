'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supaBaseClient'
import { toast } from 'sonner'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')

  const handleUpdate = async () => {
    if (password.length < 6) return toast.error('Password too short')

    const { error } = await supabase.auth.updateUser({ password })

    if (error) toast.error(error.message)
    else {
      toast.success('Password updated!')
      window.location.href = '/'
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto mt-12 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold text-center">Update Password</h2>
      <input
        type="password"
        placeholder="New Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        onClick={handleUpdate}
      >
        Set New Password
      </button>
    </div>
  )
}
