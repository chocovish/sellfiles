'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, LogIn, Facebook, Github } from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const {register, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm({
    resolver: zodResolver(loginSchema)
  })
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const email = data.email
    const password = data.password
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password, 
      })
      if (error) throw error
      router.navigate({to: '/dashboard'})
    } catch (error: any) {
      setError("root", {message: error?.message ?? 'An error occurred'}, {shouldFocus: true})
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/verify-token`
        }
      })
      if (error) throw error
    } catch (error: any) {
      setError("root", {message: error?.message ?? 'An error occurred'}, {shouldFocus: true})
    }
  }

  const handleFacebookLogin = async () => {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/api/verify-token`
        }
      })
      if (error) throw error
    } catch (error: any) {
      setError("root", {message: error?.message ?? 'An error occurred'}, {shouldFocus: true})
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden border-none shadow-xl bg-white/95 backdrop-blur-sm rounded-xl max-w-md w-full mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 opacity-90"></div>
          <div className="relative py-8 px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-purple-100 text-sm max-w-xs mx-auto">Sign in to access your account</p>
            
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
                <LogIn className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        <CardContent className="pt-10 px-6 pb-6">
          <div className="flex flex-col gap-4 mb-6">
            <Button 
              onClick={handleGoogleLogin}
              variant="outline" 
              size="lg"
              className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
            
            <Button 
              onClick={handleFacebookLogin}
              variant="outline" 
              size="lg"
              className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
            >
              <Facebook className="h-5 w-5 text-[#1877F2]" />
              Continue with Facebook
            </Button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email Address
                  </div>
                </Label>
                <Input 
                  {...register("email")} 
                  variant="auth"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 pl-2">{errors.email.message}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      Password
                    </div>
                  </Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  {...register("password")} 
                  type="password" 
                  variant="auth"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 pl-2">{errors.password.message}</p>
                )}
              </div>
              
              {errors.root && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <p className="text-sm">{errors.root.message}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                variant="gradient" 
                size="xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/auth/sign-up" className="font-medium text-purple-600 hover:text-purple-700 underline-offset-4 hover:underline transition-colors">
                Create an account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
