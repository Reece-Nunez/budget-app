'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-xl flex flex-col items-center gap-6"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
          Budgeting, Simplified.
        </h1>

        <p className="text-lg md:text-xl text-white/80">
          No bank linking. No ads. No clutter. Just a clean way to track your money.
        </p>

        <div className="bg-white/10 backdrop-blur-md p-4 px-6 rounded-xl border border-white/20 shadow-md">
          <p className="text-base text-white">
            Access everything for a one-time <span className="font-bold text-green-300">$10</span>
          </p>
        </div>

        <Link
          href="/auth"
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg"
        >
          Get Started
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12 text-sm text-white/60 max-w-md"
      >
        <p>Designed for people who just want to budget. No logins to your bank. No syncing. Just type in your numbers and go.</p>
        <p className="mt-2">Built by <a href='https://nunezdev.com' target='_blank' className="text-blue-400 hover:underline">NunezDev</a> — privacy-focused & frustration-free.</p>
      </motion.div>
    </main>
  )
}
