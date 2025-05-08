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
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full">Sign Up</Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
                >
                  Log in
                </Link>
              </div>
              <AuthProviders />
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
