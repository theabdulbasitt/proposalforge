import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase environment variables')
        return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                )
                supabaseResponse = NextResponse.next({ request })
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                )
            },
        },
    })

    // Check auth — if this fails, fail open (let request through)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        console.error('Middleware auth error:', error.message)
        return supabaseResponse
    }

    // Protect pages — redirect to login if not authenticated
    const protectedRoutes = ['/dashboard', '/profile', '/new', '/proposal']
    const isProtected = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (!user && isProtected) {
        const loginUrl = new URL('/auth/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect logged in users away from auth pages
    const authRoutes = ['/auth/login', '/auth/signup']
    const isAuthRoute = authRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (user && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}