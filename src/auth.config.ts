import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getPayload } from 'payload'
import config from '@payload-config'

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        if (!email || !password) {
          return null
        }

        const payload = await getPayload({ config })

        const result = await payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
          req,
        })

        if (!result.user) return null

        return result.user
      },
    }),
  ],
}
