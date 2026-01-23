import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
        "/admin",
        "/admin/:path*",
        "/api/admin/:path*",
    ],
};

export function middleware(req: NextRequest) {
    // Log ngay đầu để đảm bảo middleware chạy
    console.log("\n========== MIDDLEWARE TRIGGERED ==========");

    const pathname = req.nextUrl.pathname;

    // Debug log chi tiết
    console.log(`🔒 [Middleware] ==========================================`);
    console.log(`📍 Path: ${pathname}`);
    console.log(`🌐 Method: ${req.method}`);
    console.log(`🔑 ADMIN_USER configured: ${!!process.env.ADMIN_USER}`);
    console.log(`🔑 ADMIN_PASS configured: ${!!process.env.ADMIN_PASS}`);

    const user = process.env.ADMIN_USER || "";
    const pass = process.env.ADMIN_PASS || "";

    if (!user || !pass) {
        console.error("❌ [Middleware] ADMIN_USER or ADMIN_PASS not configured");
        return new NextResponse("Admin is not configured", { status: 503 });
    }

    const auth = req.headers.get("authorization") || "";
    console.log(`🔐 Authorization header present: ${!!auth}`);
    if (auth) {
        console.log(`🔐 Authorization header: ${auth.substring(0, 20)}...`);
    }

    if (!auth) {
        // Không có auth header → yêu cầu đăng nhập
        console.log(`⚠️  [Middleware] No auth header → Returning 401`);
        console.log(`==========================================\n`);
        return new NextResponse("Authentication required", {
            status: 401,
            headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
        });
    }

    const [scheme, encoded] = auth.split(" ");

    if (scheme === "Basic" && encoded) {
        try {
            const decoded = Buffer.from(encoded, "base64").toString("utf8");
            const [u, p] = decoded.split(":");
            console.log(`👤 Username from header: ${u}`);
            console.log(`🔑 Password match: ${p === pass ? "✅" : "❌"}`);
            if (u === user && p === pass) {
                console.log(`✅ [Middleware] Auth successful → Allowing access`);
                console.log(`==========================================\n`);
                return NextResponse.next();
            } else {
                console.log(`❌ [Middleware] Auth failed → Returning 401`);
            }
        } catch (error) {
            console.error("❌ [Middleware] Error decoding auth:", error);
        }
    } else {
        console.log(`❌ [Middleware] Invalid auth scheme: ${scheme}`);
    }

    // Auth không hợp lệ → yêu cầu lại
    console.log(`⚠️  [Middleware] Invalid auth → Returning 401`);
    console.log(`==========================================\n`);
    return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
}
