'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supaBaseClient'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function Login({ toggle }: { toggle: () => void }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()

    const handleLogin = async () => {
        if (!email.includes('@')) return toast.error('Invalid email')
        if (password.length < 6) return toast.error('Password too short')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            toast.error(error.message)
        } else {
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true')
                localStorage.setItem('savedEmail', email)
            } else {
                localStorage.removeItem('rememberMe')
                localStorage.removeItem('savedEmail')
            }

            toast.success('Logged in successfully!')
            router.push('/dashboard')
        }
    }

    const handleForgotPassword = async () => {
        if (!email.includes('@')) return toast.error('Please enter a valid email address.')

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Password reset email sent! Check your inbox.')
        }
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/payment`,
            },
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

            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="border p-2 rounded w-full pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600"
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember Me
                </label>
                <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={handleForgotPassword}
                >
                    Forgot Password?
                </button>
            </div>

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleLogin}
            >
                Log In with Email
            </button>

            <hr className="my-4" />

            <button
                className="flex items-center justify-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition"
                onClick={handleGoogleLogin}
            >
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
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
