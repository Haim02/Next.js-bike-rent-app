import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'


export const middleware = async (req: NextRequest, res: NextResponse) => {
    const secret = process.env.NEXTAUTH_SECRET as string;

    const token = req.cookies.get("next-auth.session-token")?.value
    || req.cookies.get("__Secure-next-auth.session-token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: [
        '/profile',
        '/profile/my-product',
        '/profile/my-requests',
        '/profile/requests-to-me',
        '/profile/upload-product',
        // '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
    ]
}