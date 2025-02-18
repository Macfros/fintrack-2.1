import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    console.log("Middleware token checking");

    const allowedOrigin = process.env.ALLOWED_ORIGIN;
    const requestOrigin = request.headers.get("origin");

    // ✅ Allow NextAuth requests
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // ✅ Apply origin check only for protected API routes
    if (!requestOrigin || requestOrigin !== allowedOrigin) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.sub) {
        return NextResponse.json(
            { message: "Unauthorized. Token is missing or invalid." },
            { status: 401 }
        );
    }

    // Clone request and attach user ID as a header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", token.sub);

    console.log("Middleware token checked. Request forwarded");

    return NextResponse.next({ request: { headers: requestHeaders } });
}

// Apply middleware only to API routes
export const config = {
    matcher: "/api/:path*",
};
