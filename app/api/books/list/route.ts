import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('tags')

  // 책 제목은 tags[0]에 저장됨
  const titles = [...new Set(
    (posts || []).map((p: any) => p.tags?.[0]).filter(Boolean)
  )].sort()

  return NextResponse.json({ titles })
}
