'use client'

import { ProviderId } from 'next-auth/providers'
import { getProviders, signIn } from 'next-auth/react'
import { ClientSafeProvider } from 'node_modules/next-auth/lib/client'
import { useEffect, useState } from 'react'

export function AuthProviders() {
  const [providers, setProviders] = useState<Record<ProviderId, ClientSafeProvider> | null>()

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }

    fetchProviders()
  }, [])

  const filtredProviders = Object.values(providers || {}).filter(
    (provider) => provider.id !== 'credentials',
  )

  return (
    filtredProviders.length > 0 && (
      <>
        <div className="flex items-center justify-center gap-2">
          <div className="h-[1px] w-full bg-slate-200" />
          <span className="text-sm text-slate-500">or</span>
          <div className="h-[1px] w-full bg-slate-200" />
        </div>
        {Object.values(filtredProviders).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
          </div>
        ))}
      </>
    )
  )
}
