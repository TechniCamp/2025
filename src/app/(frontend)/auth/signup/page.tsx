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
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { usePayloadSession } from 'payload-authjs/client'
import { AuthProviders } from '@/components/auth-providers'

const formSchema = z
  .object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default function SignupPage() {
  const router = useRouter()
  const { session } = usePayloadSession()

  useEffect(() => {
    if (session?.user) {
      router.push('/')
    }
  }, [session, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const data = await response.json()
      for (const error of data.errors) {
        for (const fieldError of error.data.errors) {
          form.setError(fieldError.path, {
            type: 'manual',
            message: fieldError.message,
          })
        }
      }

      return
    }

    router.replace('/')
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
                <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your information to create an account
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-200">Confirm Password</FormLabel>
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
                  Sign Up
                </Button>
                <div className="text-center text-sm text-gray-300">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    Log in
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
