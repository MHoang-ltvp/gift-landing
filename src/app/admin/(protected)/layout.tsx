import type { ReactNode } from "react";
import DashboardLayout from "./components/DashboardLayout";

/**
 * Layout cho toàn bộ các trang admin được bảo vệ.
 * Route group `(protected)` không ảnh hưởng URL.
 */
export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}


