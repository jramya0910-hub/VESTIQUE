'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Trash2, Minus, Plus, Tag, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase, CartItem, authedFetch } from '@/lib/supabase'

export default function CartPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_amount: number; discount_type: string; discount_value: number } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/login'); return }
    async function load() {
      const { data } = await supabase.from('cart_items').select('*, products(*)').eq('user_id', user!.id)
      setItems((data as CartItem[]) ?? [])
      setLoading(false)
    }
    load()
  }, [user, authLoading, router])

  async function updateQty(productId: string, delta: number) {
    const item = items.find(i => i.product_id === productId)
    if (!item) return
    const newQty = item.quantity + delta
    if (newQty < 1) { await removeItem(productId); return }
    await supabase.from('cart_items').update({ quantity: newQty }).eq('user_id', user!.id).eq('product_id', productId)
    setItems(prev => prev.map(i => i.product_id === productId ? { ...i, quantity: newQty } : i))
  }

  async function removeItem(productId: string) {
    await supabase.from('cart_items').delete().eq('user_id', user!.id).eq('product_id', productId)
    setItems(prev => prev.filter(i => i.product_id !== productId))
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')
    const subtotal = items.reduce((sum, item) => sum + (item.products?.price ?? 0) * item.quantity, 0)
    const res = await authedFetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, cart_total: subtotal }),
    })
    const data = await res.json()
    if (res.ok) { setAppliedCoupon(data) } else { setCouponError(data.error ?? 'Invalid coupon'); setAppliedCoupon(null) }
    setCouponLoading(false)
  }

  async function placeOrder() {
    setPlacing(true)
    const subtotal = items.reduce((sum, item) => sum + (item.products?.price ?? 0) * item.quantity, 0)
    const total = subtotal - (appliedCoupon?.discount_amount ?? 0)
    const { data: order, error: orderError } = await supabase.from('orders').insert({ user_id: user!.id, total, status: 'pending' }).select().single()
    if (orderError || !order) { alert('Failed to place order: ' + orderError?.message); setPlacing(false); return }
    const orderItems = items.map(item => ({ order_id: order.id, product_id: item.product_id, quantity: item.quantity, price: item.products?.price ?? 0 }))
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) { alert('Failed to save order items: ' + itemsError.message); setPlacing(false); return }
    await supabase.from('cart_items').delete().eq('user_id', user!.id)
    setItems([])
    setOrderSuccess(order.id)
    setPlacing(false)
  }

  const subtotal = items.reduce((sum, item) => sum + (item.products?.price ?? 0) * item.quantity, 0)
  const discount = appliedCoupon?.discount_amount ?? 0
  const total = Math.max(0, subtotal - discount)

  if (authLoading || loading) {
    return <div className="flex items-center justify-center py-20 text-royal/30 text-xs tracking-widest uppercase">Loading…</div>
  }

  if (orderSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-sage/10 border border-sage/40 p-12 max-w-md">
          <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={28} className="text-sage" />
          </div>
          <h2 className="font-serif text-3xl text-royal mb-2">Order Confirmed</h2>
          <div className="w-10 h-px bg-gold mx-auto mb-4" />
          <p className="text-royal/60 text-sm mb-2">Your order has been placed successfully.</p>
          <p className="text-xs text-royal/40 mb-6 font-mono">Order ID: {orderSuccess.slice(0, 8)}…</p>
          <div className="flex gap-3 justify-center">
            <Link href="/orders" className="btn-primary">View Orders</Link>
            <Link href="/" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="text-gold" size={22} />
        <h1 className="font-serif text-3xl text-royal tracking-wide">My Cart</h1>
        <span className="badge bg-cream text-royal border border-cream text-[10px]">{items.length} items</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag size={40} className="mx-auto text-cream mb-4" />
          <p className="font-serif text-2xl text-royal/40 mb-2">Your cart is empty</p>
          <p className="text-xs tracking-widest uppercase text-royal/30 mb-6">Discover our curated collection</p>
          <Link href="/" className="btn-primary">Browse Catalogue</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const p = item.products!
              return (
                <div key={item.product_id} className="flex gap-4 bg-white border border-cream p-4">
                  <Link href={`/product/${p.id}`}>
                    <div className="relative w-24 h-32 bg-cream/30 flex-shrink-0 overflow-hidden">
                      {p.image_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.image_url} alt={p.name} className="object-cover w-full h-full" />
                        : <div className="flex items-center justify-center h-full text-royal/20 text-xs">No img</div>}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${p.id}`}>
                      <p className="font-medium text-royal hover:text-gold transition-colors tracking-wide">{p.name}</p>
                    </Link>
                    <p className="text-[10px] tracking-widest uppercase text-royal/40 mt-0.5">{p.category}</p>
                    <p className="font-serif text-gold mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => updateQty(p.id, -1)} className="p-1.5 border border-cream hover:border-gold text-royal/60 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-royal">{item.quantity}</span>
                      <button onClick={() => updateQty(p.id, 1)} className="p-1.5 border border-cream hover:border-gold text-royal/60 transition-colors">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(p.id)} className="ml-2 p-1.5 text-royal/30 hover:text-blush transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-royal">₹{(p.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-cream p-6 sticky top-24">
              <h3 className="font-serif text-xl text-royal mb-1">Order Summary</h3>
              <div className="w-8 h-px bg-gold mb-4" />

              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.product_id} className="flex justify-between text-xs text-royal/60">
                    <span className="truncate max-w-[60%]">{item.products?.name} × {item.quantity}</span>
                    <span>₹{((item.products?.price ?? 0) * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t border-cream mt-4 pt-4">
                <label className="label mb-2 block">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-sage/10 border border-sage/30 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag size={13} className="text-sage" />
                      <span className="text-xs font-medium text-royal">{appliedCoupon.code}</span>
                      <span className="text-xs text-sage">−₹{appliedCoupon.discount_amount.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => setAppliedCoupon(null)} className="text-royal/30 hover:text-blush"><X size={13} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={e => { setCouponCode(e.target.value); setCouponError('') }}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()} placeholder="Enter code" className="input text-xs flex-1" />
                    <button onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()} className="btn-secondary text-xs px-4">
                      {couponLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[10px] text-blush mt-1">{couponError}</p>}
                <p className="text-[10px] text-royal/30 mt-1 tracking-wide">Try: WELCOME10, FLAT200, FASHION20</p>
              </div>

              <div className="border-t border-cream mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-royal/60">
                  <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-sage font-medium">
                    <span>Coupon Discount</span><span>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-serif text-xl pt-2 border-t border-cream">
                  <span className="text-royal">Total</span>
                  <span className="text-gold">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button onClick={placeOrder} disabled={placing} className="btn-primary w-full mt-6 py-3">
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>
              <p className="text-[10px] text-center text-royal/30 mt-3 tracking-wide">No payment required for this demo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
