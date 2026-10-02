"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 shadow-2xl backdrop-blur-md text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 border border-neutral-800 p-2 mb-6 shadow-inner">
        <Image
          src="/logo.png"
          alt="The Habit Tracker logo"
          width={48}
          height={48}
          className="h-10 w-10 object-contain"
        />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Welcome to The Habit Tracker
      </h1>
      <p className="mt-2 text-sm text-neutral-400">
        Build better habits. One day at a time. Sign in with Google to start tracking your consistency.
      </p>

      {/* Error Alert Message */}
      {error && (
        <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-left">
          <div className="flex items-start gap-3 text-rose-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold block text-rose-300">
                {error === "OAuthCallback" ? "Google OAuth Callback Error" : "Authentication Error"}
              </span>
              <p className="mt-1 text-rose-300/80 leading-relaxed">
                {error === "OAuthCallback"
                  ? "Google authentication failed. Please verify that GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET are valid and http://localhost:3000/api/auth/callback/google is added to Authorized Redirect URIs in Google Cloud Console."
                  : "An authentication error occurred. Please try signing in again."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition-all shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
          <ArrowRight className="h-4 w-4 ml-auto text-neutral-400" />
        </button>
      </div>

      <p className="mt-6 text-xs text-neutral-500">
        By continuing, you agree to track your habits responsibly.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-sm text-neutral-400">Loading...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
