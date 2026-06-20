'use client'

import { useRouter } from 'next/navigation'

export default function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('이 글을 삭제할까요?')) return

    await fetch('/api/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId }),
    })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-600 transition"
    >
      삭제
    </button>
  )
}
