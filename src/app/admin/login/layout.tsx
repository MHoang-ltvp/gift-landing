import type { ReactNode } from "react";

/**
 * Login page layout (KHÔNG guard)
 * Vì `/admin/*` sẽ bị guard ở `src/app/admin/layout.tsx`,
 * nên cần override riêng cho `/admin/login` để tránh redirect loop.
 */
export default function AdminLoginLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}


