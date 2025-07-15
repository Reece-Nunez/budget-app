'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supaBaseClient'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) alert(error.message)
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        })

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
                    onClick={handleEmailLogin}
                >
                    Log In with Email
                </button>

                <hr className="my-4" />

                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    onClick={handleGoogleLogin}
                >
                    Sign In with Google
                </button>
            </div>
        )
    }
}
