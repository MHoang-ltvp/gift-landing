import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-super-secret-key-change-in-production"
);

const TOKEN_EXPIRY = "24h"; // Token hết hạn sau 24 giờ

/**
 * Tạo JWT token từ username
 */
export async function createToken(username: string): Promise<string> {
    const token = await new SignJWT({ username })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(SECRET_KEY);

    return token;
}

/**
 * Verify JWT token và trả về payload
 */
export async function verifyToken(token: string): Promise<{ username: string } | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as { username: string };
    } catch (error) {
        return null;
    }
}

/**
 * Lấy token từ cookie hoặc Authorization header
 */
export function getTokenFromRequest(request: Request): string | null {
    // Thử lấy từ cookie trước
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
        const cookies = cookieHeader.split(";").map((c) => c.trim());
        const tokenCookie = cookies.find((c) => c.startsWith("admin_token="));
        if (tokenCookie) {
            return tokenCookie.split("=")[1];
        }
    }

    // Thử lấy từ Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }

    return null;
}

