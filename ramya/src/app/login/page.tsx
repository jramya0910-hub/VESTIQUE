'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) { setError(loginError.message); setLoading(false); return }
    setLoading(false)
    router.push('/')
    router.refresh()
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-2">Welcome back</p>
          <h1 className="font-serif text-4xl text-royal tracking-wide">LUXY HAVEN</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-3" />
        </div>

        <div className="bg-white border border-cream p-8 space-y-5">
          {error && (
            <div className="border border-blush bg-blush/10 text-royal text-xs px-4 py-3 tracking-wide">
              {error}
            </div>
          )}

          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="input" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="input" placeholder="Your password" required />
          </div>

          <button type="submit" onClick={handleLogin} disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-cream" />
            <span className="text-[10px] tracking-widest uppercase text-royal/40">or</span>
            <div className="flex-1 border-t border-cream" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn-secondary w-full flex items-center justify-center gap-2 py-3"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs tracking-wide text-royal/50">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-gold font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
