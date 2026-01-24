import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createToken } from "@/lib/auth";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { username, password } = body;

        // Validate input
        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        // Check credentials
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            // Tạo token
            const token = await createToken(username);

            // Tạo response với token trong cookie
            const response = NextResponse.json({
                success: true,
                message: "Login successful",
            });

            // Set cookie với token
            response.cookies.set("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            });

            return response;
        } else {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

