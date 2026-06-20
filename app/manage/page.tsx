import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'

export default async function ManagePage() {
  const session = await auth()
  if (!session) redirect('/')

  const role = session.user?.role
  const isAdmin = role === 'admin'

  let query = supabaseAdmin
    .from('posts')
    .select('*, author:profiles(name)')
    .order('created_at', { ascending: false })

  // 작가는 자신의 글만, 관리자는 전체
  if (!isAdmin) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', session.user?.email!)
      .single()

    if (profile) query = query.eq('author_id', profile.id)
  }

  const { data: posts } = await query

  return (
    <div style={{ padding: '2.5rem 4rem' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">서재관리</h1>
        <Link
          href="/write"
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          + 새 글
        </Link>
      </div>

      {isAdmin && (
        <Link href="/admin" className="inline-block mb-6 text-sm text-gray-500 underline">
          회원 관리 →
        </Link>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {posts && posts.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-600 font-medium">제목</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">카테고리</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">공개</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">상태</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">날짜</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/posts/${post.id}`} className="font-medium text-gray-900 hover:underline">
                      {post.title}
                    </Link>
                    {isAdmin && post.author?.name && (
                      <span className="text-xs text-gray-400 ml-2">by {post.author.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{post.category || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      post.visibility === 'public'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {post.visibility === 'public' ? '모두' : '회원'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      post.published ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {post.published ? '발행' : '초안'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/write/${post.id}`}
                        style={{ color: 'var(--accent)', fontSize: '0.78rem' }}
                        className="hover:opacity-70 transition">수정</Link>
                      <DeleteButton postId={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 text-gray-400">글이 없습니다.</div>
        )}
      </div>
    </div>
  )
}
