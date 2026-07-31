'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { ShoppingBag, Heart, Package, Upload, LogIn, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFAF7] border-b border-lime">
      {/* Top luxury bar */}
      <div className="bg-royal text-cream text-center text-[10px] tracking-[0.25em] uppercase py-1.5 font-light">
        Free shipping on orders above ₹2,999
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="Luxy Haven" width={38} height={38} className="rounded-full object-cover ring-2 ring-gold/40" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-2xl tracking-widest text-royal">LUXY HAVEN</span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-gold font-light">Luxury Fashion</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-xs tracking-widest uppercase text-royal/70 hover:text-gold transition-colors">
              Catalogue
            </Link>
            {user && (
              <>
                <Link href="/wishlist" className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-royal/70 hover:text-gold transition-colors">
                  <Heart size={14} /> Wishlist
                </Link>
                <Link href="/cart" className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-royal/70 hover:text-gold transition-colors">
                  <ShoppingBag size={14} /> Cart
                </Link>
                <Link href="/orders" className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-royal/70 hover:text-gold transition-colors">
                  <Package size={14} /> Orders
                </Link>
                {profile?.role === 'designer' && (
                  <>
                    <Link href="/designer/dashboard" className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-royal/70 hover:text-gold transition-colors">
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link href="/designer/upload" className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-royal/70 hover:text-gold transition-colors">
                      <Upload size={14} /> Upload
                    </Link>
                  </>
                )}
                <Link href="/profile" className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-royal/70 hover:text-gold transition-colors">
                  <User size={14} /> {profile?.full_name?.split(' ')[0] ?? 'Profile'}
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-royal/70 hover:text-blush transition-colors"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </>
            )}
            {!user && (
              <Link href="/login" className="btn-primary text-xs">
                <span className="flex items-center gap-1.5"><LogIn size={13} /> Sign in</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-royal"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-px bg-current mb-1.5" />
            <span className="block w-5 h-px bg-current mb-1.5" />
            <span className="block w-5 h-px bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-lime bg-[#FFFAF7] px-6 py-5 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-royal/70">Catalogue</Link>
          {user && (
            <>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-royal/70">Wishlist</Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-royal/70">Cart</Link>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-royal/70">Orders</Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-royal/70">My Profile</Link>
              {profile?.role === 'designer' && (
                <>
                  <Link href="/designer/dashboard" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-royal/70">Dashboard</Link>
                  <Link href="/designer/upload" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-royal/70">Upload Product</Link>
                </>
              )}
              <button onClick={() => { signOut(); setMenuOpen(false) }} className="text-xs tracking-widest uppercase text-blush text-left">Sign out</button>
            </>
          )}
          {!user && (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-xs w-fit">Sign in</Link>
          )}
        </div>
      )}
    </nav>
  )
}
