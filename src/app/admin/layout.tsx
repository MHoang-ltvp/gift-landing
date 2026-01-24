import type { ReactNode } from "react";

/**
 * Base layout cho route `/admin/*`.
 *
 * Lưu ý: Layout trong Next.js là nested, nên nếu guard ở đây thì `/admin/login`
 * cũng bị guard và tạo redirect-loop.
 *
 * Guard thật sự được đặt trong route group: `src/app/admin/(protected)/layout.tsx`
 */
export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <>{children}</>;
}

