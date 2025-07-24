'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      if (res.status === 401) {
        // not logged in → send to login
        router.push('/login')
        return
      }
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      console.error(err)
      alert('Could not start checkout—please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <h1 className="text-4xl font-bold mb-6">Unlock Budget App</h1>
      <p className="text-lg text-white/80 mb-4">One-time payment of $10</p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-semibold shadow-lg transition"
      >
        {loading ? 'Redirecting…' : 'Pay $10 with Card'}
      </button>
    </main>
  )
}
