import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-8">
      <h1 className="text-4xl font-bold">Welcome to Budget App</h1>
      <p className="text-lg max-w-md">
        Track your income, expenses, and plan your financial goals with ease.
      </p>
      <Link
        href="/auth"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Get Started
      </Link>
    </main>
  )
}
