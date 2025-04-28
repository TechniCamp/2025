import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    // signOut: '/auth/logout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: undefined,
  },
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

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        const json = await res.json()
        console.log('json', json)

        return json.user
      },
    }),
  ],
}
