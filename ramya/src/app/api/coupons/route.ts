import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// POST /api/coupons  { code, cart_total }
// Returns: { discount_type, discount_value, discount_amount }
export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, cart_total } = await req.json()
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 })

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single()

  if (error || !coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
  }

  // Check min order
  const total = Number(cart_total) || 0
  if (total < (coupon.min_order ?? 0)) {
    return NextResponse.json({ error: `Minimum order ₹${coupon.min_order} required` }, { status: 400 })
  }

  const discountAmount = coupon.discount_type === 'percent'
    ? Math.round(total * coupon.discount_value / 100)
    : Math.min(coupon.discount_value, total)

  return NextResponse.json({
    code: coupon.code,
    discount_type: coupon.discount_type,
    discount_value: coupon.discount_value,
    discount_amount: discountAmount,
  })
}
