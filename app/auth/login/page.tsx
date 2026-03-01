"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
        })

        if (error) {
            setError('Invalid email or password. Please try again.')
            setLoading(false)
            return
        }

        router.push('/dashboard')
        router.refresh()
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>Sign in to your ProposalForge account</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-black font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}