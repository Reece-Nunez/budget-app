'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { BudgetProvider } from "@/lib/budget-store";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // hydrate the Supabase cookie once on the client
  useEffect(() => {
    const supabase = createClientComponentClient();
    supabase.auth.getSession();
  }, []);

  // figure out what route we’re on
  const path = usePathname();
  const isHome = path === "/";

  // a small wrapper so we don’t repeat the providers
  const PageWithProviders = (
    <BudgetProvider>
      {children}
      <div id="portal" />
    </BudgetProvider>
  );

  return (
    <html lang="en">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {isHome ? (
          // on home: no AuthProvider
          PageWithProviders
        ) : (
          // everywhere else: wrap in AuthProvider
          <AuthProvider>
            {PageWithProviders}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
