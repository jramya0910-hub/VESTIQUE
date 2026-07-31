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
    <nav className="sticky top-0 z-50 bg-[#1A0000]/85 backdrop-blur-md border-b border-[#5C1010]">
      {/* Top maroon announcement bar */}
      <div className="bg-[#5C1010] text-[#FBC02D] text-center text-[10px] tracking-[0.3em] uppercase py-1.5 font-light">
        Free shipping on orders above ₹2,999
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="Luxy Haven" width={38} height={38} className="rounded-full object-cover ring-2 ring-[#FBC02D]/50" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-2xl tracking-widest text-[#FBC02D]" style={{ textShadow: '0 0 20px rgba(251,192,45,0.3)' }}>
                LUXY HAVEN
              </span>
              <span className="text-[9px] tracking-[0.35em] uppercase text-[#F5E6D0]/50 font-light">Luxury Fashion</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[10px] tracking-widest uppercase text-[#F5E6D0]/60 hover:text-[#FBC02D] transition-colors">
              Catalogue
            </Link>
            {user && (
              <>
                <Link href="/wishlist" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#F5E6D0]/60 hover:text-[#FBC02D] transition-colors">
                  <Heart size={13} /> Wishlist
                </Link>
                <Link href="/cart" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#F5E6D0]/60 hover:text-[#FBC02D] transition-colors">
                  <ShoppingBag size={13} /> Cart
                </Link>
                <Link href="/orders" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#F5E6D0]/60 hover:text-[#FBC02D] transition-colors">
                  <Package size={13} /> Orders
                </Link>
                {profile?.role === 'designer' && (
                  <>
                    <Link href="/designer/dashboard" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#F5E6D0]/60 hover:text-[#FBC02D] transition-colors">
                      <LayoutDashboard size={13} /> Dashboard
                    </Link>
                    <Link href="/designer/upload" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#F5E6D0]/60 hover:text-[#FBC02D] transition-colors">
                      <Upload size={13} /> Upload
                    </Link>
                  </>
                )}
                <Link href="/profile" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#F5E6D0]/60 hover:text-[#FBC02D] transition-colors">
                  <User size={13} /> {profile?.full_name?.split(' ')[0] ?? 'Profile'}
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#F5E6D0]/60 hover:text-[#C0392B] transition-colors"
                >
                  <LogOut size={13} /> Sign out
                </button>
              </>
            )}
            {!user && (
              <Link href="/login" className="btn-primary">
                <span className="flex items-center gap-1.5"><LogIn size={12} /> Sign in</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#FBC02D]"
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
        <div className="md:hidden border-t border-[#5C1010] bg-[#1A0000]/95 backdrop-blur-md px-6 py-5 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-[10px] tracking-widest uppercase text-[#F5E6D0]/60">Catalogue</Link>
          {user && (
            <>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="text-[10px] tracking-widest uppercase text-[#F5E6D0]/60">Wishlist</Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="text-[10px] tracking-widest uppercase text-[#F5E6D0]/60">Cart</Link>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-[10px] tracking-widest uppercase text-[#F5E6D0]/60">Orders</Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-[10px] tracking-widest uppercase text-[#F5E6D0]/60">My Profile</Link>
              {profile?.role === 'designer' && (
                <>
                  <Link href="/designer/dashboard" onClick={() => setMenuOpen(false)} className="text-[10px] tracking-widest uppercase text-[#F5E6D0]/60">Dashboard</Link>
                  <Link href="/designer/upload" onClick={() => setMenuOpen(false)} className="text-[10px] tracking-widest uppercase text-[#F5E6D0]/60">Upload Product</Link>
                </>
              )}
              <button onClick={() => { signOut(); setMenuOpen(false) }} className="text-[10px] tracking-widest uppercase text-[#C0392B] text-left">Sign out</button>
            </>
          )}
          {!user && (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-primary w-fit">Sign in</Link>
          )}
        </div>
      )}
    </nav>
  )
}
