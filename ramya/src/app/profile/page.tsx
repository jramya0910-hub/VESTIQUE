'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { User, Package, Save, Edit2, CheckCircle } from 'lucide-react'

type Order = {
  id: string
  status: string
  total: number
  created_at: string
}

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [editMode, setEditMode] = useState(false)
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/login'); return }
    setFullName(profile?.full_name ?? '')

    async function loadOrders() {
      const { data } = await supabase
        .from('orders')
        .select('id, status, total, created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setOrders((data as Order[]) ?? [])
    }
    loadOrders()
  }, [user, profile, authLoading, router])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', user.id)
    if (error) showToast('Failed to save: ' + error.message)
    else { showToast('Profile updated ✓'); setEditMode(false) }
    setSaving(false)
  }

  if (authLoading) {
    return <div className="flex items-center justify-center py-20 text-gray-400">Loading…</div>
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <User className="text-violet-600" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-2xl font-bold">
              {(profile?.full_name ?? user?.email ?? 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">{profile?.full_name ?? 'No name set'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className={`badge mt-1 inline-block capitalize ${
                profile?.role === 'designer'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {profile?.role ?? 'customer'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="btn-secondary flex items-center gap-1 text-sm"
          >
            <Edit2 size={14} /> Edit
          </button>
        </div>

        {editMode && (
          <div className="border-t border-gray-100 pt-5">
            <div className="mb-4">
              <label className="label">Full Name</label>
              <input
                className="input mt-1"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="mb-4">
              <label className="label">Email</label>
              <input
                className="input mt-1 bg-gray-50 cursor-not-allowed"
                value={user?.email ?? ''}
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed here</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditMode(false); setFullName(profile?.full_name ?? '') }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Account Details</h2>
        <div className="space-y-3">
          {[
            { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
            { label: 'Account Type', value: (profile?.role ?? 'customer').charAt(0).toUpperCase() + (profile?.role ?? 'customer').slice(1) },
            { label: 'User ID', value: (user?.id ?? '').slice(0, 8) + '…' },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm font-medium text-gray-800">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-violet-600" />
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <button
            onClick={() => router.push('/orders')}
            className="text-sm text-violet-600 hover:underline font-medium"
          >
            View all →
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Package size={32} className="mx-auto mb-2 text-gray-200" />
            <p className="text-sm">No orders yet</p>
            <button onClick={() => router.push('/')} className="btn-primary mt-3 text-sm">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800 font-mono">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 text-sm">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                  <span className={`badge text-xs capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.status === 'delivered' && <CheckCircle size={10} className="inline mr-0.5" />}
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
