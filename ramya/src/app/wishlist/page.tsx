'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Trash2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase, WishlistItem } from '@/lib/supabase'

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/login'); return }
    async function load() {
      const { data } = await supabase.from('wishlist').select('*, products(*)').eq('user_id', user!.id).order('created_at', { ascending: false })
      setItems((data as WishlistItem[]) ?? [])
      setLoading(false)
    }
    load()
  }, [user, authLoading, router])

  async function removeItem(productId: string) {
    await supabase.from('wishlist').delete().eq('user_id', user!.id).eq('product_id', productId)
    setItems(prev => prev.filter(i => i.product_id !== productId))
  }

  async function addToCart(productId: string) {
    const { data: existing } = await supabase.from('cart_items').select('quantity').eq('user_id', user!.id).eq('product_id', productId).single()
    if (existing) {
      await supabase.from('cart_items').update({ quantity: existing.quantity + 1 }).eq('user_id', user!.id).eq('product_id', productId)
    } else {
      await supabase.from('cart_items').insert({ user_id: user!.id, product_id: productId, quantity: 1 })
    }
    router.push('/cart')
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center py-20 text-royal/30 text-xs tracking-widest uppercase">Loading…</div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-blush" size={22} />
        <h1 className="font-serif text-3xl text-royal tracking-wide">My Wishlist</h1>
        <span className="badge bg-cream text-royal border border-cream text-[10px]">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={40} className="mx-auto text-blush/30 mb-4" />
          <p className="font-serif text-2xl text-royal/40 mb-2">Your wishlist is empty</p>
          <p className="text-xs tracking-widest uppercase text-royal/30 mb-6">Save the pieces you love</p>
          <Link href="/" className="btn-primary">Browse Catalogue</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map(item => {
            const p = item.products!
            return (
              <div key={item.product_id} className="card group">
                <Link href={`/product/${p.id}`}>
                  <div className="relative aspect-[3/4] bg-cream/30 overflow-hidden">
                    {p.image_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.image_url} alt={p.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                      : <div className="flex items-center justify-center h-full text-royal/20 text-xs tracking-widest uppercase">No image</div>}
                  </div>
                </Link>
                <div className="p-4 bg-white">
                  <Link href={`/product/${p.id}`}>
                    <p className="font-medium text-royal truncate hover:text-gold transition-colors text-sm tracking-wide">{p.name}</p>
                  </Link>
                  <p className="font-serif text-base text-gold mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => addToCart(p.id)} className="btn-primary text-[10px] flex-1 py-2">
                      Add to Cart
                    </button>
                    <button onClick={() => removeItem(p.id)} className="p-2 text-royal/30 hover:text-blush border border-cream hover:border-blush transition-colors" aria-label="Remove">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
