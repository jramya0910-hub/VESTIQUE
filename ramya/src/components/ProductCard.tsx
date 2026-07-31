'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Product } from '@/lib/supabase'

interface ProductCardProps {
  product: Product
  wishlisted?: boolean
  onWishlist?: (productId: string) => void
}

export default function ProductCard({ product, wishlisted, onWishlist }: ProductCardProps) {
  return (
    <div className="card group">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] bg-cream/30 overflow-hidden">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-royal/20 text-xs tracking-widest uppercase">
              No image
            </div>
          )}
          {/* Luxury overlay on hover */}
          <div className="absolute inset-0 bg-royal/0 group-hover:bg-royal/10 transition-all duration-300" />
        </div>
      </Link>

      <div className="p-4 bg-white">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/product/${product.id}`}>
              <p className="font-medium text-[#059669] truncate hover:text-gold transition-colors text-sm tracking-wide">
                {product.name}
              </p>
            </Link>
            <p className="text-[10px] tracking-widest uppercase text-royal/40 mt-0.5">{product.category}</p>
          </div>
          {onWishlist && (
            <button
              onClick={() => onWishlist(product.id)}
              className="flex-shrink-0 p-1.5 hover:bg-blush/10 transition-colors"
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={16}
                className={wishlisted ? 'fill-blush text-blush' : 'text-royal/30'}
              />
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-serif text-base text-gold tracking-wide">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  )
}
