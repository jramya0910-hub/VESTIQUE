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
      <body className="min-h-screen text-[#F5E6D0] antialiased">
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-[#5C1010] mt-16 py-10 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FBC02D]/50 mb-1">
              © {new Date().getFullYear()} Luxy Haven
            </p>
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#F5E6D0]/20">
              Crafted with love for luxury fashion
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
