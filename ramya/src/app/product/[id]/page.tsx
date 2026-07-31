'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heart, ShoppingBag, ArrowLeft, Share2, Star, StarOff, Send, Camera } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import ProductCard from '@/components/ProductCard'
import TryOnModal from '@/components/TryOnModal'

type Review = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profiles: { full_name: string | null } | null
}

const RECENTLY_VIEWED_KEY = 'ramya_recently_viewed'
function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? '[]') } catch { return [] }
}
function addRecentlyViewed(id: string) {
  if (typeof window === 'undefined') return
  const list = getRecentlyViewed().filter(v => v !== id)
  list.unshift(id)
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list.slice(0, 10)))
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [recommended, setRecommended] = useState<Product[]>([])
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [myReview, setMyReview] = useState<{ rating: number; comment: string } | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [inCart, setInCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(false)
  const [wishLoading, setWishLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [showTryOn, setShowTryOn] = useState(false)

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      setProduct(data)
      setLoading(false)
      if (data) {
        addRecentlyViewed(id)
        const recRes = await fetch(`/api/recommend?productId=${id}&category=${encodeURIComponent(data.category)}`)
        const recData = await recRes.json()
        setRecommended(Array.isArray(recData) ? recData : [])
        const rvIds = getRecentlyViewed().filter(v => v !== id).slice(0, 5)
        if (rvIds.length > 0) {
          const { data: rvProds } = await supabase.from('products').select('*').in('id', rvIds)
          if (rvProds) {
            const ordered = rvIds.map(rvId => rvProds.find((p: Product) => p.id === rvId)).filter(Boolean) as Product[]
            setRecentlyViewedProducts(ordered)
          }
        }
      }
    }
    load()
  }, [id])

  useEffect(() => {
    async function loadReviews() {
      const res = await fetch(`/api/reviews?product_id=${id}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setReviews(data)
        if (user) {
          const mine = data.find((r: Review & { user_id?: string }) => r.user_id === user.id)
          if (mine) { setMyReview({ rating: mine.rating, comment: mine.comment ?? '' }); setReviewRating(mine.rating); setReviewComment(mine.comment ?? '') }
        }
      }
    }
    loadReviews()
  }, [id, user])

  useEffect(() => {
    if (!user || !product) return
    async function checkStatus() {
      const { data: w } = await supabase.from('wishlist').select('product_id').eq('user_id', user!.id).eq('product_id', product!.id).maybeSingle()
      setWishlisted(!!w)
      const { data: c } = await supabase.from('cart_items').select('product_id').eq('user_id', user!.id).eq('product_id', product!.id).maybeSingle()
      setInCart(!!c)
    }
    checkStatus()
  }, [user, product])

  async function handleWishlist() {
    if (!user) { router.push('/login'); return }
    setWishLoading(true)
    if (wishlisted) {
      const { error } = await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product!.id)
      if (error) { alert('Wishlist remove error: ' + error.message); setWishLoading(false); return }
      setWishlisted(false); showToast('Removed from wishlist')
    } else {
      const { error } = await supabase.from('wishlist').insert({ user_id: user.id, product_id: product!.id })
      if (error) { alert('Wishlist add error: ' + error.message); setWishLoading(false); return }
      setWishlisted(true); showToast('Added to wishlist')
    }
    setWishLoading(false)
  }

  async function handleAddToCart() {
    if (!user) { router.push('/login'); return }
    setCartLoading(true)
    const { data: existing } = await supabase.from('cart_items').select('quantity').eq('user_id', user.id).eq('product_id', product!.id).single()
    if (existing) {
      const { error } = await supabase.from('cart_items').update({ quantity: existing.quantity + 1 }).eq('user_id', user.id).eq('product_id', product!.id)
      if (error) { alert('Cart error: ' + error.message); setCartLoading(false); return }
    } else {
      const { error } = await supabase.from('cart_items').insert({ user_id: user.id, product_id: product!.id, quantity: 1 })
      if (error) { alert('Cart error: ' + error.message); setCartLoading(false); return }
    }
    setInCart(true); showToast('Added to cart')
    setCartLoading(false)
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) { await navigator.share({ title: product?.name ?? 'Product', url }) }
    else { await navigator.clipboard.writeText(url); showToast('Link copied!') }
  }

  async function submitReview() {
    if (!user) { router.push('/login'); return }
    setSubmittingReview(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
      body: JSON.stringify({ product_id: id, rating: reviewRating, comment: reviewComment }),
    })
    const data = await res.json()
    if (res.ok) {
      showToast('Review submitted')
      setMyReview({ rating: reviewRating, comment: reviewComment })
      setShowReviewForm(false)
      const reviewsRes = await fetch(`/api/reviews?product_id=${id}`)
      const reviewsData = await reviewsRes.json()
      if (Array.isArray(reviewsData)) setReviews(reviewsData)
    } else { showToast('Error: ' + (data.error ?? 'Failed to submit')) }
    setSubmittingReview(false)
  }

  async function deleteReview() {
    if (!user) return
    const res = await fetch(`/api/reviews?product_id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
    })
    if (res.ok) {
      showToast('Review deleted')
      setMyReview(null); setReviewRating(5); setReviewComment('')
      const reviewsRes = await fetch(`/api/reviews?product_id=${id}`)
      const reviewsData = await reviewsRes.json()
      if (Array.isArray(reviewsData)) setReviews(reviewsData)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
        <div className="h-80 bg-cream/50" />
        <div className="h-6 bg-cream/50 w-1/2" />
        <div className="h-4 bg-cream/50 w-1/4" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="font-serif text-2xl text-royal/40">Product not found</p>
        <button onClick={() => router.back()} className="btn-primary mt-6">Go back</button>
      </div>
    )
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
    return (
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
          <Star key={n} size={size} className={n <= rating ? 'fill-gold text-gold' : 'text-cream'} />
        ))}
      </span>
    )
  }

  return (
    <div>
      {showTryOn && <TryOnModal product={product} onClose={() => setShowTryOn(false)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-royal text-cream px-5 py-3 text-xs tracking-widest shadow-lg">
          {toast}
        </div>
      )}

      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-royal/40 hover:text-gold mb-8 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-cream/30">
          {product.image_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
            : <div className="flex items-center justify-center h-full text-royal/20 text-xs tracking-widest uppercase">No image</div>}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="badge bg-cream text-royal border border-cream text-[10px] tracking-widest mb-3 w-fit capitalize">{product.category}</span>
          <h1 className="font-serif text-4xl text-royal leading-tight">{product.name}</h1>
          <p className="font-serif text-3xl text-gold mt-3">₹{product.price.toLocaleString('en-IN')}</p>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-2 mt-3">
              <StarRow rating={Math.round(Number(avgRating))} />
              <span className="text-xs text-royal/60">{avgRating}</span>
              <span className="text-xs text-royal/30">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}

          {product.description && (
            <p className="text-royal/60 mt-5 leading-relaxed text-sm">{product.description}</p>
          )}

          <div className="w-12 h-px bg-gold my-6" />

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleWishlist}
              disabled={wishLoading}
              className={`flex items-center gap-2 px-5 py-2.5 border text-xs tracking-widest uppercase font-medium transition-colors ${
                wishlisted ? 'bg-blush/10 border-blush text-blush' : 'btn-secondary'
              }`}
            >
              <Heart size={15} className={wishlisted ? 'fill-blush text-blush' : ''} />
              {wishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>

            <button onClick={handleAddToCart} disabled={cartLoading}
              className="btn-primary flex items-center gap-2 flex-1 justify-center py-2.5">
              <ShoppingBag size={15} />
              {inCart ? 'Add Again' : 'Add to Cart'}
            </button>

            <button onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 border border-cream text-royal/40 hover:border-gold hover:text-gold transition-colors"
              title="Share product">
              <Share2 size={15} />
            </button>

            <button onClick={() => setShowTryOn(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-steel/30 text-steel hover:bg-steel/10 transition-colors"
              title="Virtual Try-On">
              <Camera size={15} />
            </button>
          </div>

          {inCart && (
            <button onClick={() => router.push('/cart')} className="mt-3 text-[10px] tracking-widest uppercase text-gold hover:underline">
              View cart →
            </button>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-2xl text-royal">
            Customer Reviews {reviews.length > 0 && <span className="text-base text-royal/30 font-normal">({reviews.length})</span>}
          </h2>
          {user && !myReview && !showReviewForm && (
            <button onClick={() => setShowReviewForm(true)} className="btn-primary text-xs flex items-center gap-1.5">
              <Star size={12} /> Write a Review
            </button>
          )}
        </div>
        <div className="w-12 h-px bg-gold mb-8" />

        {/* Review form */}
        {(showReviewForm || (user && myReview)) && (
          <div className="bg-white border border-cream p-6 mb-6">
            <h3 className="font-serif text-lg text-royal mb-4">{myReview ? 'Your Review' : 'Write a Review'}</h3>
            <div className="mb-4">
              <label className="label mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => !myReview && setReviewRating(n)} disabled={!!myReview} className="focus:outline-none">
                    {n <= reviewRating
                      ? <Star size={22} className="fill-gold text-gold" />
                      : <StarOff size={22} className="text-cream" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="label mb-1 block">Comment (optional)</label>
              <textarea value={myReview ? myReview.comment ?? '' : reviewComment}
                onChange={e => !myReview && setReviewComment(e.target.value)}
                disabled={!!myReview} rows={3}
                placeholder="Share your experience…"
                className="input resize-none" />
            </div>
            <div className="flex gap-3">
              {myReview ? (
                <>
                  <button onClick={() => { setMyReview(null); setShowReviewForm(true) }} className="btn-secondary text-xs">Edit Review</button>
                  <button onClick={deleteReview} className="text-xs tracking-widest uppercase text-blush hover:text-royal transition-colors">Delete</button>
                </>
              ) : (
                <>
                  <button onClick={submitReview} disabled={submittingReview} className="btn-primary flex items-center gap-2 text-xs">
                    <Send size={12} /> {submittingReview ? 'Submitting…' : 'Submit Review'}
                  </button>
                  <button onClick={() => setShowReviewForm(false)} className="btn-secondary text-xs">Cancel</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-cream/20 border border-cream">
            <Star size={24} className="mx-auto text-cream mb-2" />
            <p className="text-xs tracking-widest uppercase text-royal/30">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="bg-white border border-cream p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blush/20 border border-blush/30 flex items-center justify-center text-royal text-xs font-serif">
                      {(review.profiles?.full_name ?? 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-royal font-medium">{review.profiles?.full_name ?? 'Customer'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={11} className={n <= review.rating ? 'fill-gold text-gold' : 'text-cream'} />
                      ))}
                    </span>
                    <span className="text-[10px] text-royal/30">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                {review.comment && <p className="text-royal/60 text-sm leading-relaxed">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl text-royal mb-1">You may also like</h2>
          <div className="w-12 h-px bg-gold mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommended.map(rec => <ProductCard key={rec.id} product={rec} />)}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl text-royal mb-1">Recently Viewed</h2>
          <div className="w-12 h-px bg-gold mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentlyViewedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
