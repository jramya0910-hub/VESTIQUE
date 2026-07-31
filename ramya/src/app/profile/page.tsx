'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { User, Package, Save, Edit2, CheckCircle } from 'lucide-react'

type Order = { id: string; status: string; total: number; created_at: string }

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [editMode, setEditMode] = useState(false)
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/login'); return }
    setFullName(profile?.full_name ?? '')
    async function loadOrders() {
      const { data } = await supabase.from('orders').select('id, status, total, created_at').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5)
      setOrders((data as Order[]) ?? [])
    }
    loadOrders()
  }, [user, profile, authLoading, router])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName.trim() }).eq('id', user.id)
    if (error) showToast('Failed to save: ' + error.message)
    else { showToast('Profile updated ✓'); setEditMode(false) }
    setSaving(false)
  }

  if (authLoading) {
    return <div className="flex items-center justify-center py-20 text-royal/30 text-xs tracking-widest uppercase">Loading…</div>
  }

  const STATUS_STYLES: Record<string, string> = {
    pending:   'bg-cream text-gold border border-gold/30',
    shipped:   'bg-steel/10 text-steel border border-steel/30',
    delivered: 'bg-sage/10 text-sage border border-sage/30',
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-royal text-cream px-5 py-3 text-xs tracking-widest shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <User className="text-gold" size={22} />
        <h1 className="font-serif text-3xl text-royal tracking-wide">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="card mb-6 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blush/20 border border-blush/30 flex items-center justify-center text-royal font-serif text-2xl">
              {(profile?.full_name ?? user?.email ?? 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-serif text-xl text-royal">{profile?.full_name ?? 'No name set'}</p>
              <p className="text-xs text-royal/50 mt-0.5">{user?.email}</p>
              <span className={`badge mt-2 inline-block text-[10px] tracking-widest capitalize px-3 py-0.5 ${
                profile?.role === 'designer' ? 'bg-steel/10 text-steel border border-steel/30' : 'bg-cream text-royal border border-cream'
              }`}>
                {profile?.role ?? 'customer'}
              </span>
            </div>
          </div>
          <button onClick={() => setEditMode(!editMode)} className="btn-secondary flex items-center gap-1.5 text-xs">
            <Edit2 size={12} /> Edit
          </button>
        </div>

        {editMode && (
          <div className="border-t border-cream pt-5">
            <div className="mb-4">
              <label className="label">Full Name</label>
              <input className="input mt-1" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="mb-4">
              <label className="label">Email</label>
              <input className="input mt-1 bg-cream/20 cursor-not-allowed" value={user?.email ?? ''} disabled />
              <p className="text-[10px] text-royal/30 mt-1 tracking-wide">Email cannot be changed here</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-xs">
                <Save size={12} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={() => { setEditMode(false); setFullName(profile?.full_name ?? '') }} className="btn-secondary text-xs">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Details */}
      <div className="card mb-6 p-6">
        <h2 className="font-serif text-lg text-royal mb-1">Account Details</h2>
        <div className="w-6 h-px bg-gold mb-4" />
        <div className="space-y-3">
          {[
            { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
            { label: 'Account Type', value: (profile?.role ?? 'customer').charAt(0).toUpperCase() + (profile?.role ?? 'customer').slice(1) },
            { label: 'User ID', value: (user?.id ?? '').slice(0, 8) + '…' },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-cream last:border-0">
              <span className="text-[10px] tracking-widest uppercase text-royal/40">{row.label}</span>
              <span className="text-sm font-medium text-royal">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-gold" />
            <h2 className="font-serif text-lg text-royal">Recent Orders</h2>
          </div>
          <button onClick={() => router.push('/orders')} className="text-[10px] tracking-widest uppercase text-gold hover:underline">
            View all →
          </button>
        </div>
        <div className="w-6 h-px bg-gold mb-4" />

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={28} className="mx-auto mb-2 text-cream" />
            <p className="text-xs tracking-widest uppercase text-royal/30">No orders yet</p>
            <button onClick={() => router.push('/')} className="btn-primary mt-4 text-xs">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-cream last:border-0">
                <div>
                  <p className="text-xs font-medium text-royal font-mono">#{order.id.slice(0, 8)}</p>
                  <p className="text-[10px] text-royal/40 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-royal">₹{order.total.toLocaleString('en-IN')}</span>
                  <span className={`badge text-[10px] tracking-widest capitalize px-2 py-0.5 ${STATUS_STYLES[order.status] ?? 'bg-cream text-royal'}`}>
                    {order.status === 'delivered' && <CheckCircle size={9} className="inline mr-0.5" />}
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
