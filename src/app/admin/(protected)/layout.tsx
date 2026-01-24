import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

/**
 * Guard cho toàn bộ các trang admin được bảo vệ.
 * Route group `(protected)` không ảnh hưởng URL, nhưng giúp `/admin/login`
 * không bị dính guard (tránh redirect-loop).
 */
export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
        redirect("/admin/login");
    }

    const payload = await verifyToken(token);
    if (!payload) {
        redirect("/admin/login?error=invalid_token");
    }

    return <>{children}</>;
}


