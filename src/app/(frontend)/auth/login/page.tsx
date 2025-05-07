'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { signIn } from 'next-auth/react'
import { usePayloadSession } from 'payload-authjs/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProviders } from '@/components/auth-providers'

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export default function LoginPage() {
  const { session } = usePayloadSession()
  const router = useRouter()

  useEffect(() => {
    console.log('session', session)

    if (session?.user) {
      router.push('/app')
    }
  }, [session, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    signIn('credentials', {
      redirectTo: '/app',
      ...data,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Animated dots in background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-2 h-2 bg-blue-500 rounded-full top-1/4 left-1/4 animate-pulse"
          style={{ animationDuration: '3s' }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-purple-500 rounded-full top-1/3 left-2/3 animate-pulse"
          style={{ animationDuration: '4s' }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-green-500 rounded-full top-1/2 left-1/3 animate-pulse"
          style={{ animationDuration: '5s' }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-yellow-500 rounded-full top-2/3 left-3/4 animate-pulse"
          style={{ animationDuration: '4.5s' }}
        ></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md relative z-10">
          <div className="relative group">
            {/* Border gradient */}
            <div className="absolute inset-0 p-0.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

            <Card className="border-0 bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-white">Log in</CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-200">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-200">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all shadow-md hover:shadow-lg border-0">
                  Log in
                </Button>
                <div className="text-center text-sm text-gray-300">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    Sign up
                  </Link>
                </div>
                <AuthProviders />
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  )
}
