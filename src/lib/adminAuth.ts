import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export async function getAdminOrNull(): Promise<{ username: string } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function requireAdminOrResponse(): Promise<{ username: string } | Response> {
    const admin = await getAdminOrNull();
    if (!admin) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return admin;
}


