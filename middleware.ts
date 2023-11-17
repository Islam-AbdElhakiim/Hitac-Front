import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    if (pathName == "/") {
        console.log("home");
        const url = request.nextUrl.clone()
        url.pathname = '/employees'
        return NextResponse.redirect(url)
    }
    return NextResponse.next();
}