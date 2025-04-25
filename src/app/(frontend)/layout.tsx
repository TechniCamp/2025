import React from 'react'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { PayloadSessionProvider } from 'payload-authjs/client'
import { getPayloadSession } from 'payload-authjs'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PayloadSessionProvider session={await getPayloadSession()}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
          </ThemeProvider>
        </PayloadSessionProvider>
      </body>
    </html>
  )
}
