"use client";

import { useRouter } from "next/navigation";
import AdminCard from "@/app/admin/components/AdminCard";
import { theme } from "@/lib/theme";

export default function AdminHome() {
    const router = useRouter();

    const handleLogout = async () => {
        if (confirm("Bạn có chắc muốn đăng xuất?")) {
            try {
                await fetch("/api/admin/logout", { method: "POST" });
                router.push("/admin/login");
                router.refresh();
            } catch (error) {
                console.error("Logout error:", error);
            }
        }
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: theme.colors.bgPrimary,
                padding: theme.spacing.xl,
                fontFamily: theme.typography.fontFamily.body,
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: theme.spacing.xl,
                        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                        backgroundColor: theme.colors.bgWhite,
                        borderRadius: theme.borderRadius.xl,
                        boxShadow: theme.shadows.md,
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: theme.typography.fontSize["4xl"],
                                fontWeight: theme.typography.fontWeight.bold,
                                margin: 0,
                                marginBottom: theme.spacing.xs,
                                color: theme.colors.textPrimary,
                                fontFamily: theme.typography.fontFamily.display,
                                display: "flex",
                                alignItems: "center",
                                gap: theme.spacing.md,
                            }}
                        >
                            <span>🎛️</span>
                            <span>Admin Dashboard</span>
                        </h1>
                        <p
                            style={{
                                color: theme.colors.textSecondary,
                                fontSize: theme.typography.fontSize.md,
                                margin: 0,
                                marginLeft: 48, // Align with title text
                            }}
                        >
                            Quản lý sản phẩm và thiệp chúc mừng
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                            backgroundColor: theme.colors.error,
                            color: theme.colors.textWhite,
                            border: "none",
                            borderRadius: theme.borderRadius.lg,
                            cursor: "pointer",
                            fontSize: theme.typography.fontSize.md,
                            fontWeight: theme.typography.fontWeight.semibold,
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing.sm,
                            transition: theme.transitions.normal,
                            boxShadow: theme.shadows.sm,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#c62828";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = theme.shadows.md;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = theme.colors.error;
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = theme.shadows.sm;
                        }}
                    >
                        <span>🚪</span>
                        <span>Đăng xuất</span>
                    </button>
                </div>

                {/* Main Cards Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: theme.spacing.xl,
                    }}
                >
                    <AdminCard
                        href="/admin/products"
                        title="Quản lý Sản phẩm"
                        description="Tạo và quản lý sản phẩm quà tặng"
                        color={theme.colors.primary}
                        icon="📦"
                    />
                    <AdminCard
                        href="/admin/cards"
                        title="Quản lý Thiệp"
                        description="Tạo thiệp chúc mừng và tải QR code"
                        color="#4caf50"
                        icon="💌"
                    />
                    <AdminCard
                        href="/admin/settings"
                        title="Cài Đặt"
                        description="Cấu hình mạng xã hội và Google Sheets"
                        color="#a855f7"
                        icon="⚙️"
                    />
                </div>
            </div>
        </main>
    );
}


