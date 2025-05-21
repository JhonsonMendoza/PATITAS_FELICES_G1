// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('fake-auth-token')?.value
  const pathname = request.nextUrl.pathname

  // Simular rutas protegidas
  const protectedRoutes = ['/dashboard', '/profile']
  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path))

  if (isProtected && !token) {
    // Redirige si no hay "autenticación"
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}
