import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Luxy Haven — Fashion for Everyone',
  description: 'Discover curated fashion from independent designers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-[#FBC02D] antialiased">
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-[#4A3060] mt-16 py-8 text-center text-xs tracking-widest uppercase text-[#FBC02D]/40">
            © {new Date().getFullYear()} Luxy Haven — Crafted with love for fashion.
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
