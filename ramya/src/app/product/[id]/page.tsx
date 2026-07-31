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

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Load product + recommendations
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

        // Load recently viewed products (excluding this one)
        const rvIds = getRecentlyViewed().filter(v => v !== id).slice(0, 5)
        if (rvIds.length > 0) {
          const { data: rvProds } = await supabase.from('products').select('*').in('id', rvIds)
          if (rvProds) {
            // Preserve order
            const ordered = rvIds.map(rvId => rvProds.find((p: Product) => p.id === rvId)).filter(Boolean) as Product[]
            setRecentlyViewedProducts(ordered)
          }
        }
      }
    }
    load()
  }, [id])

  // Load reviews
  useEffect(() => {
    async function loadReviews() {
      const res = await fetch(`/api/reviews?product_id=${id}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setReviews(data)
        if (user) {
          const mine = data.find((r: Review & { user_id?: string }) => r.user_id === user.id)
          if (mine) {
            setMyReview({ rating: mine.rating, comment: mine.comment ?? '' })
            setReviewRating(mine.rating)
            setReviewComment(mine.comment ?? '')
          }
        }
      }
    }
    loadReviews()
  }, [id, user])

  // Check wishlist/cart status
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
      setWishlisted(true); showToast('Added to wishlist ♥')
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
    setInCart(true); showToast('Added to cart 🛍️')
    setCartLoading(false)
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: product?.name ?? 'Product', url })
    } else {
      await navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard!')
    }
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
      showToast('Review submitted ✓')
      setMyReview({ rating: reviewRating, comment: reviewComment })
      setShowReviewForm(false)
      // Refresh reviews
      const reviewsRes = await fetch(`/api/reviews?product_id=${id}`)
      const reviewsData = await reviewsRes.json()
      if (Array.isArray(reviewsData)) setReviews(reviewsData)
    } else {
      showToast('Error: ' + (data.error ?? 'Failed to submit'))
    }
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
      setMyReview(null)
      setReviewRating(5)
      setReviewComment('')
      const reviewsRes = await fetch(`/api/reviews?product_id=${id}`)
      const reviewsData = await reviewsRes.json()
      if (Array.isArray(reviewsData)) setReviews(reviewsData)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
        <div className="h-80 bg-gray-100 rounded-2xl" />
        <div className="h-6 bg-gray-100 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-1/4" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">Product not found</p>
        <button onClick={() => router.back()} className="btn-primary mt-4">Go back</button>
      </div>
    )
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
    return (
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
          <Star key={n} size={size} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
        ))}
      </span>
    )
  }

  return (
    <div>
      {/* TryOn Modal */}
      {showTryOn && <TryOnModal product={product} onClose={() => setShowTryOn(false)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-lg transition-all">
          {toast}
        </div>
      )}

      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">No image</div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="badge bg-violet-100 text-violet-700 mb-3 w-fit capitalize">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-3xl font-bold text-violet-700 mt-3">₹{product.price.toLocaleString('en-IN')}</p>

          {/* Rating summary */}
          {avgRating && (
            <div className="flex items-center gap-2 mt-3">
              <StarRow rating={Math.round(Number(avgRating))} />
              <span className="text-sm text-gray-600 font-medium">{avgRating}</span>
              <span className="text-sm text-gray-400">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}

          {product.description && (
            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          )}

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleWishlist}
              disabled={wishLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition-colors ${
                wishlisted ? 'bg-red-50 border-red-300 text-red-600' : 'btn-secondary'
              }`}
            >
              <Heart size={18} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
              {wishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="btn-primary flex items-center gap-2 flex-1 justify-center"
            >
              <ShoppingBag size={18} />
              {inCart ? 'Add Again' : 'Add to Cart'}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600 transition-colors"
              title="Share product"
            >
              <Share2 size={18} />
            </button>

            <button
              onClick={() => setShowTryOn(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors"
              title="Virtual Try-On"
            >
              <Camera size={18} />
            </button>
          </div>

          {inCart && (
            <button onClick={() => router.push('/cart')} className="mt-3 text-sm text-violet-600 font-medium hover:underline">
              View cart →
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Reviews {reviews.length > 0 && <span className="text-base text-gray-400 font-normal">({reviews.length})</span>}
          </h2>
          {user && !myReview && !showReviewForm && (
            <button onClick={() => setShowReviewForm(true)} className="btn-primary text-sm flex items-center gap-1.5">
              <Star size={14} /> Write a Review
            </button>
          )}
        </div>

        {/* Review form */}
        {(showReviewForm || (user && myReview)) && (
          <div className="card mb-6 border-violet-200">
            <h3 className="font-semibold text-gray-900 mb-4">{myReview ? 'Your Review' : 'Write a Review'}</h3>
            <div className="mb-4">
              <label className="label mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => !myReview && setReviewRating(n)}
                    disabled={!!myReview}
                    className="focus:outline-none"
                  >
                    {n <= reviewRating
                      ? <Star size={24} className="fill-amber-400 text-amber-400" />
                      : <StarOff size={24} className="text-gray-300" />
                    }
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="label mb-1 block">Comment (optional)</label>
              <textarea
                value={myReview ? myReview.comment ?? '' : reviewComment}
                onChange={e => !myReview && setReviewComment(e.target.value)}
                disabled={!!myReview}
                rows={3}
                placeholder="Share your experience with this product…"
                className="input resize-none"
              />
            </div>
            <div className="flex gap-3">
              {myReview ? (
                <>
                  <button onClick={() => { setMyReview(null); setShowReviewForm(true) }} className="btn-secondary text-sm">Edit Review</button>
                  <button onClick={deleteReview} className="text-sm text-red-500 hover:text-red-700 font-medium">Delete Review</button>
                </>
              ) : (
                <>
                  <button
                    onClick={submitReview}
                    disabled={submittingReview}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <Send size={14} /> {submittingReview ? 'Submitting…' : 'Submit Review'}
                  </button>
                  <button onClick={() => setShowReviewForm(false)} className="btn-secondary text-sm">Cancel</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
            <Star size={28} className="mx-auto text-gray-200 mb-2" />
            <p className="text-gray-400">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold">
                      {(review.profiles?.full_name ?? 'U')[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800 text-sm">{review.profiles?.full_name ?? 'Customer'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={12} className={n <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                      ))}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                {review.comment && <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommended.map(rec => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentlyViewedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
