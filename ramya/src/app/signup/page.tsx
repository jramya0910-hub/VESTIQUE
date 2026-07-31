'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'designer'>('customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: signupError } = await supabase.auth.signUp({ email, password })
    if (signupError) { setError(signupError.message); setLoading(false); return }
    if (!data.session) {
      setError('Please check your email and confirm your account before signing in.')
      setLoading(false)
      return
    }
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({ id: data.user.id, full_name: fullName, role })
      if (profileError) { setError(`Account created but profile setup failed: ${profileError.message}`); setLoading(false); return }
    }
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-2">Join the exclusive</p>
          <h1 className="font-serif text-4xl text-royal tracking-wide">LUXY HAVEN</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-3" />
        </div>

        <form onSubmit={handleSignup} className="bg-white border border-cream p-8 space-y-5">
          {error && (
            <div className="border border-blush bg-blush/10 text-royal text-xs px-4 py-3 tracking-wide">
              {error}
            </div>
          )}

          <div>
            <label className="label">Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              className="input" placeholder="Your full name" required />
          </div>

          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="input" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="input" placeholder="Min. 6 characters" minLength={6} required />
          </div>

          <div>
            <label className="label">I am a…</label>
            <select value={role} onChange={e => setRole(e.target.value as 'customer' | 'designer')} className="input">
              <option value="customer">Customer — shopping for fashion</option>
              <option value="designer">Designer — uploading products</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className="text-center text-xs tracking-wide text-royal/50">
            Already have an account?{' '}
            <Link href="/login" className="text-gold font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
