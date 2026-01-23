import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export function middleware(req: NextRequest) {
    const user = process.env.ADMIN_USER || "";
    const pass = process.env.ADMIN_PASS || "";

    if (!user || !pass) {
        return new NextResponse("Admin is not configured", { status: 503 });
    }

    const auth = req.headers.get("authorization") || "";
    const [scheme, encoded] = auth.split(" ");

    if (scheme === "Basic" && encoded) {
        const decoded = Buffer.from(encoded, "base64").toString("utf8");
        const [u, p] = decoded.split(":");
        if (u === user && p === pass) return NextResponse.next();
    }

    return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
}
