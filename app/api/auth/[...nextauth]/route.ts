import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { createClient } from '@/lib/supabase/server'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'

interface AuthUser {
  id: string
  email: string
  name: string
  role: 'customer' | 'business' | 'admin'
  verified: boolean
}

interface ExtendedToken extends JWT {
  id?: string
  role?: string
  verified?: boolean
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        try {
          const supabase = await createClient()

          // Verify credentials with Supabase Auth
          const { data: user, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error || !user.user) {
            throw new Error('Invalid email or password')
          }

          // Get user role from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, name, role, verified')
            .eq('id', user.user.id)
            .single()

          if (userError || !userData) {
            throw new Error('User not found in database')
          }

          return {
            id: userData.id as string,
            email: userData.email as string,
            name: userData.name as string,
            role: userData.role as 'customer' | 'business' | 'admin',
            verified: userData.verified as boolean,
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
          throw new Error(errorMessage)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = (user as AuthUser).id
        token.role = (user as AuthUser).role
        token.verified = (user as AuthUser).verified
      }
      return token as ExtendedToken
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).verified = token.verified as boolean
      }
      return session as Session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
