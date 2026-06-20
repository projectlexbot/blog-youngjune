import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { supabaseAdmin } from './supabase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log('[signIn] user:', user.email)
      if (!user.email) return false

      const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
      console.log('[signIn] isAdmin:', isAdmin, 'adminEmail:', process.env.NEXT_PUBLIC_ADMIN_EMAIL)

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          role: isAdmin ? 'admin' : 'reader',
        }, { onConflict: 'email', ignoreDuplicates: false })
        .select()

      console.log('[signIn] upsert result:', data, error)
      return true
    },
    async session({ session }) {
      if (!session.user?.email) return session

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('email', session.user.email)
        .single()

      if (profile) {
        session.user.id = profile.id
        session.user.role = profile.role
      }
      return session
    },
  },
})
