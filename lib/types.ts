export type Role = 'admin' | 'writer' | 'reader'

export interface Profile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: Role
  created_at: string
}

export interface Post {
  id: string
  title: string
  content: string | null
  category: string | null
  tags: string[] | null
  visibility: 'public' | 'members'
  published: boolean
  author_id: string
  author?: Profile
  created_at: string
  updated_at: string
}
