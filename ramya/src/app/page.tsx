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

    // Client-side price filter
    if (minPrice) list = list.filter(p => p.price >= Number(minPrice))
    if (maxPrice) list = list.filter(p => p.price <= Number(maxPrice))

    // Sort
    list = [...list].sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      if (sort === 'name_asc') return a.name.localeCompare(b.name)
      // newest: newest first (default API order)
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
      <div className="bg-violet-50 rounded-2xl p-8 md:p-12 mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-violet-800 mb-3">
          Fashion that tells your story
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Discover curated designs from independent designers.
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dresses, sarees, kurtis…"
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || (minPrice || maxPrice)
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filter
            {(minPrice || maxPrice) && (
              <span className="w-2 h-2 bg-white rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable price filter */}
      {showFilters && (
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="label text-xs">Min Price (₹)</label>
            <input
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="0"
              className="input mt-1 w-32"
            />
          </div>
          <div>
            <label className="label text-xs">Max Price (₹)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="Any"
              className="input mt-1 w-32"
            />
          </div>
          {(minPrice || maxPrice) && (
            <button
              onClick={() => { setMinPrice(''); setMaxPrice('') }}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 pb-2"
            >
              <X size={14} /> Clear price
            </button>
          )}
        </div>
      )}

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {sort !== 'newest' && (
            <span className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1 rounded-full">
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
              <button onClick={() => setSort('newest')}><X size={10} /></button>
            </span>
          )}
          {category !== 'All' && (
            <span className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1 rounded-full">
              {category}
              <button onClick={() => setCategory('All')}><X size={10} /></button>
            </span>
          )}
          {minPrice && (
            <span className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1 rounded-full">
              Min ₹{minPrice}
              <button onClick={() => setMinPrice('')}><X size={10} /></button>
            </span>
          )}
          {maxPrice && (
            <span className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1 rounded-full">
              Max ₹{maxPrice}
              <button onClick={() => setMaxPrice('')}><X size={10} /></button>
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
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === c
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl font-medium">No products found</p>
          <p className="text-sm mt-2">Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <button
              onClick={() => { setCategory('All'); setSort('newest'); setMinPrice(''); setMaxPrice('') }}
              className="btn-primary mt-4 text-sm"
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
