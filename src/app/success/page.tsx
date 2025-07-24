import Link from 'next/link'

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <h1 className="text-4xl font-bold mb-4">🎉 Payment Successful!</h1>
      <p className="text-lg mb-6">
        Thanks for unlocking Budget Bones—your one‑time payment has been processed.
      </p>
      <Link href="/dashboard" replace>
        <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-semibold shadow-lg transition">
          Go to Budget Bones
        </button>
      </Link>
    </main>
  )
}
