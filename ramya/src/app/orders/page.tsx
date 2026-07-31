'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase, Order } from '@/lib/supabase'

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-cream text-gold border border-gold/30',
  shipped:   'bg-steel/10 text-steel border border-steel/30',
  delivered: 'bg-sage/10 text-sage border border-sage/30',
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/login'); return }
    async function load() {
      const { data } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('user_id', user!.id).order('created_at', { ascending: false })
      setOrders((data as Order[]) ?? [])
      setLoading(false)
    }
    load()
  }, [user, authLoading, router])

  function toggleExpand(id: string) {
    setExpanded(prev => { const s = new Set(prev); if (s.has(id)) { s.delete(id) } else { s.add(id) } return s })
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center py-20 text-royal/30 text-xs tracking-widest uppercase">Loading…</div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Package className="text-gold" size={22} />
        <h1 className="font-serif text-3xl text-royal tracking-wide">My Orders</h1>
        <span className="badge bg-cream text-royal border border-cream text-[10px]">{orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <Package size={40} className="mx-auto text-cream mb-4" />
          <p className="font-serif text-2xl text-royal/40 mb-2">No orders yet</p>
          <p className="text-xs tracking-widest uppercase text-royal/30 mb-6">Start your luxury journey</p>
          <Link href="/" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-cream overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-cream/20 transition-colors"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className={`badge text-[10px] tracking-widest capitalize px-3 py-1 ${STATUS_STYLES[order.status] ?? 'bg-cream text-royal'}`}>
                    {order.status}
                  </span>
                  <div>
                    <p className="font-medium text-royal text-sm">
                      Order · {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-royal/30 mt-0.5 font-mono">{order.id.slice(0, 16)}…</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-serif text-xl text-gold">₹{order.total.toLocaleString('en-IN')}</p>
                  {expanded.has(order.id)
                    ? <ChevronUp size={16} className="text-royal/30" />
                    : <ChevronDown size={16} className="text-royal/30" />}
                </div>
              </div>

              {expanded.has(order.id) && order.order_items && (
                <div className="border-t border-[#4A3060] px-5 py-4 bg-[#120720]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-[10px] tracking-widest uppercase text-royal/40">
                        <th className="pb-3">Product</th>
                        <th className="pb-3 text-right">Qty</th>
                        <th className="pb-3 text-right">Unit Price</th>
                        <th className="pb-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream">
                      {order.order_items!.map(item => (
                        <tr key={item.product_id}>
                          <td className="py-2.5 text-royal">
                            <Link href={`/product/${item.product_id}`} className="hover:text-gold transition-colors">
                              {item.products?.name ?? 'Product'}
                            </Link>
                          </td>
                          <td className="py-2.5 text-right text-royal/50">{item.quantity}</td>
                          <td className="py-2.5 text-right text-royal/50">₹{item.price.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 text-right font-medium text-royal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
