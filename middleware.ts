import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./src/lib/auth";

export const config = {
    matcher: [
        "/admin",
        "/admin/:path*",
        "/api/admin/:path*",
    ],
};

// Routes không cần auth
const PUBLIC_ROUTES = ["/admin/login", "/api/admin/login", "/api/admin/logout"];

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Debug nhẹ để biết middleware có chạy hay không (dev only)
    if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(`[middleware] ${req.method} ${pathname}`);
    }

    // Cho phép truy cập login page và login API
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // GET settings: public cho footer (mọi tab/browser đều load được)
    if (pathname === "/api/admin/settings" && req.method === "GET") {
        return NextResponse.next();
    }

    // Lấy token từ cookie (ưu tiên) hoặc Authorization: Bearer <token>
    const token =
        req.cookies.get("admin_token")?.value ||
        (req.headers.get("authorization")?.startsWith("Bearer ")
            ? req.headers.get("authorization")!.slice("Bearer ".length)
            : null);

    if (!token) {
        // Không có token → redirect về login
        if (pathname.startsWith("/admin")) {
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        // API route → trả về 401
        return NextResponse.json(
            { error: "Unauthorized - Token required" },
            { status: 401 }
        );
    }

    // Verify token
    const payload = await verifyToken(token);

    if (!payload) {
        // Token không hợp lệ → redirect về login
        if (pathname.startsWith("/admin")) {
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("redirect", pathname);
            loginUrl.searchParams.set("error", "invalid_token");
            return NextResponse.redirect(loginUrl);
        }
        // API route → trả về 401
        return NextResponse.json(
            { error: "Unauthorized - Invalid token" },
            { status: 401 }
        );
    }

    // Token hợp lệ → cho phép truy cập
    return NextResponse.next();
}

