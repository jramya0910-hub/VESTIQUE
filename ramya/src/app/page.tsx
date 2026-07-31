'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { authedFetch, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Search, SlidersHorizontal, X } from 'lucide-react'

const CATEGORIES = ['All', 'Sarees', 'Kurtas', 'Lehengas', 'Gowns', 'Dresses', 'Tops', 'Co-ords', 'Other']

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
]

export default function HomePage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'All') params.set('category', category)
    const res = await fetch(`/api/products?${params}`)
    const data: Product[] = await res.json()
    let list = Array.isArray(data) ? data : []

    if (minPrice) list = list.filter(p => p.price >= Number(minPrice))
    if (maxPrice) list = list.filter(p => p.price <= Number(maxPrice))

    list = [...list].sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      if (sort === 'name_asc') return a.name.localeCompare(b.name)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    setProducts(list)
    setLoading(false)
  }, [search, category, sort, minPrice, maxPrice])

  const fetchWishlist = useCallback(async () => {
    if (!user) return
    const res = await authedFetch('/api/wishlist')
    const data = await res.json()
    if (Array.isArray(data)) {
      setWishlistIds(new Set(data.map((w: { product_id: string }) => w.product_id)))
    }
  }, [user])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { fetchWishlist() }, [fetchWishlist])

  async function handleWishlist(productId: string) {
    if (!user) { window.location.href = '/login'; return }
    if (wishlistIds.has(productId)) {
      await authedFetch(`/api/wishlist?product_id=${productId}`, { method: 'DELETE' })
      setWishlistIds(prev => { const s = new Set(prev); s.delete(productId); return s })
    } else {
      await authedFetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      })
      setWishlistIds(prev => new Set(Array.from(prev).concat(productId)))
    }
  }

  const hasActiveFilters = minPrice || maxPrice || sort !== 'newest' || category !== 'All'

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-royal rounded-none p-10 md:p-16 mb-12 text-center overflow-hidden">
        {/* decorative blush glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blush/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-steel/20 blur-3xl pointer-events-none" />

        <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-4 font-light">
          — Curated Luxury —
        </p>
        <h1 className="font-serif text-4xl md:text-6xl text-cream mb-4 leading-tight">
          Fashion that tells<br />your story
        </h1>
        <div className="w-16 h-px bg-gold mx-auto mb-4" />
        <p className="text-cream/60 text-sm max-w-md mx-auto tracking-wide font-light">
          Discover exquisite designs from independent designers, crafted for the discerning few.
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search sarees, lehengas, gowns…"
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <SlidersHorizontal size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input pl-9 pr-10 appearance-none cursor-pointer min-w-[180px]"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2 border text-xs font-medium tracking-widest uppercase transition-colors ${
              showFilters || (minPrice || maxPrice)
                ? 'bg-royal text-cream border-royal'
                : 'bg-white text-royal border-cream hover:border-gold'
            }`}
          >
            <SlidersHorizontal size={13} />
            Filter
            {(minPrice || maxPrice) && (
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable price filter */}
      {showFilters && (
        <div className="bg-cream/40 border border-cream rounded-none p-4 mb-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="label">Min Price (₹)</label>
            <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" className="input mt-1 w-32" />
          </div>
          <div>
            <label className="label">Max Price (₹)</label>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Any" className="input mt-1 w-32" />
          </div>
          {(minPrice || maxPrice) && (
            <button
              onClick={() => { setMinPrice(''); setMaxPrice('') }}
              className="flex items-center gap-1 text-xs tracking-widest uppercase text-blush hover:text-royal pb-2 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {sort !== 'newest' && (
            <span className="flex items-center gap-1 bg-cream text-royal text-[10px] font-medium tracking-widest uppercase px-3 py-1 border border-gold/30">
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
              <button onClick={() => setSort('newest')}><X size={9} /></button>
            </span>
          )}
          {category !== 'All' && (
            <span className="flex items-center gap-1 bg-cream text-royal text-[10px] font-medium tracking-widest uppercase px-3 py-1 border border-gold/30">
              {category}
              <button onClick={() => setCategory('All')}><X size={9} /></button>
            </span>
          )}
          {minPrice && (
            <span className="flex items-center gap-1 bg-cream text-royal text-[10px] font-medium tracking-widest uppercase px-3 py-1 border border-gold/30">
              Min ₹{minPrice}
              <button onClick={() => setMinPrice('')}><X size={9} /></button>
            </span>
          )}
          {maxPrice && (
            <span className="flex items-center gap-1 bg-cream text-royal text-[10px] font-medium tracking-widest uppercase px-3 py-1 border border-gold/30">
              Max ₹{maxPrice}
              <button onClick={() => setMaxPrice('')}><X size={9} /></button>
            </span>
          )}
        </div>
      )}

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 text-xs font-medium tracking-widest uppercase border transition-colors ${
              category === c
                ? 'bg-royal text-cream border-royal'
                : 'bg-white text-royal/60 border-cream hover:border-gold hover:text-gold'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs tracking-widest uppercase text-royal/40 mb-4">
          {products.length} piece{products.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-cream/50 animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-royal/40">
          <p className="font-serif text-2xl mb-2">No pieces found</p>
          <p className="text-xs tracking-widest uppercase mt-2">Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <button
              onClick={() => { setCategory('All'); setSort('newest'); setMinPrice(''); setMaxPrice('') }}
              className="btn-primary mt-6 text-xs"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              wishlisted={wishlistIds.has(product.id)}
              onWishlist={handleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  )
}
