import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { userService, auditService } from './db'
import { env } from './env'
import bcrypt from 'bcryptjs'
import { sendVerificationRequest } from './email'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/onboarding',
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      sendVerificationRequest,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await userService.getUserByEmail(credentials.email)
        
        if (!user) {
          return null
        }

        // For demo purposes, we'll create a simple password check
        // In production, you'd have password hashing from registration
        const isPasswordValid = credentials.password === 'demo123' || 
          await bcrypt.compare(credentials.password, user.email) // Placeholder

        if (!isPasswordValid) {
          return null
        }

        // Update last login
        await userService.updateLastLogin(user.id)

        // Log authentication event
        await auditService.log({
          userId: user.id,
          action: 'LOGIN',
          resource: 'User',
          resourceId: user.id,
          ipAddress: req.headers?.['x-forwarded-for'] as string || 
                    req.headers?.['x-real-ip'] as string || 
                    'unknown',
          userAgent: req.headers?.['user-agent'],
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Allow sign in
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.subscriptionTier = token.subscriptionTier as string
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        
        // Get additional user data
        const fullUser = await userService.getUserByEmail(user.email!)
        if (fullUser) {
          token.subscriptionTier = fullUser.subscriptionTier
          token.timezone = fullUser.timezone
          token.language = fullUser.language
        }
      }
      return token
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && user.email) {
        // Log new user registration
        await auditService.log({
          userId: user.id,
          action: 'REGISTER',
          resource: 'User',
          resourceId: user.id,
          newValues: {
            email: user.email,
            name: user.name,
            provider: account?.provider,
          },
        })
      }
    },
    async signOut({ token }) {
      if (token?.id) {
        // Log sign out event
        await auditService.log({
          userId: token.id as string,
          action: 'LOGOUT',
          resource: 'User',
          resourceId: token.id as string,
        })
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
}