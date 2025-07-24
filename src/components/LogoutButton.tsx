'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supaBaseClient'
import { toast } from 'sonner'

export default function LogoutButton() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // in LogoutButton.tsx
    const handleLogout = async () => {
        setLoading(true);

        // Sign out using Supabase's default behavior:
        const { error } = await supabase.auth.signOut();

        setLoading(false);
        if (error) {
            toast.error('Logout failed');
        } else {
            toast.success('Logged out');
            router.push('/auth');
        }
    };


    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-white font-semibold transition"
        >
            {loading ? 'Signing out…' : 'Log Out'}
        </button>
    )
}
