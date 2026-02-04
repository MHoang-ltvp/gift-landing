"use client";

import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardLayoutProps {
    children: ReactNode;
}

interface MenuItem {
    href?: string;
    label: string;
    icon: string;
    children?: MenuItem[];
}

interface MenuGroup {
    label: string;
    items: MenuItem[];
}

const PRIMARY_COLOR = "#7C3AED"; // Purple
const BG_LIGHT = "#F8F9FA"; // Light grey background
const TEXT_PRIMARY = "#1F2937";
const TEXT_SECONDARY = "#6B7280";
const TEXT_TERTIARY = "#9CA3AF";
const BORDER_COLOR = "#E5E7EB";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["quan-ly"]));

    const menuGroups: MenuGroup[] = [
        {
            label: "Quản lý",
            items: [
                {
                    href: "/admin/products",
                    label: "Sản phẩm",
                    icon: "📦",
                },
                {
                    href: "/admin/cards",
                    label: "Thiệp",
                    icon: "💌",
                },
            ],
        },
        {
            label: "Hệ thống",
            items: [
                {
                    href: "/admin/settings",
                    label: "Cài đặt",
                    icon: "⚙️",
                },
            ],
        },
    ];

    const isActive = (href?: string) => {
        if (!href) return false;
        if (href === "/admin/products") {
            return pathname === "/admin/products";
        }
        return pathname?.startsWith(href);
    };

    const toggleGroup = (groupLabel: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupLabel)) {
            newExpanded.delete(groupLabel);
        } else {
            newExpanded.add(groupLabel);
        }
        setExpandedGroups(newExpanded);
    };

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
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: BG_LIGHT }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: "250px",
                    backgroundColor: "#ffffff",
                    borderRight: `1px solid ${BORDER_COLOR}`,
                    display: "flex",
                    flexDirection: "column",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: "24px 20px",
                        borderBottom: `1px solid ${BORDER_COLOR}`,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #764ba2 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                            }}
                        >
                            <span>📊</span>
                        </div>
                        <span style={{ fontSize: "16px", fontWeight: 600, color: TEXT_PRIMARY }}>
                            Dashboard v.01
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
                    {menuGroups.map((group) => {
                        const isExpanded = expandedGroups.has(group.label);
                        return (
                            <div key={group.label} style={{ marginBottom: "16px" }}>
                                {/* Group Header */}
                                <button
                                    onClick={() => toggleGroup(group.label)}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "8px 16px",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: TEXT_TERTIARY,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    <span>{group.label}</span>
                                    <span style={{ fontSize: "10px", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                                        ▼
                                    </span>
                                </button>

                                {/* Group Items */}
                                {isExpanded && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        {group.items.map((item) => {
                                            const active = isActive(item.href);
                                            const hasChildren = item.children && item.children.length > 0;
                                            const isParentActive = active || (hasChildren && item.children?.some((child) => isActive(child.href)));

                                            return (
                                                <div key={item.label}>
                                                    {item.href ? (
                                                        <Link
                                                            href={item.href}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                                padding: "12px 16px",
                                                                marginBottom: "4px",
                                                                borderRadius: "8px",
                                                                textDecoration: "none",
                                                                color: active ? "#ffffff" : TEXT_SECONDARY,
                                                                backgroundColor: active ? PRIMARY_COLOR : "transparent",
                                                                fontWeight: active ? 500 : 400,
                                                                fontSize: "14px",
                                                                transition: "all 0.2s",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (!active) {
                                                                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (!active) {
                                                                    e.currentTarget.style.backgroundColor = "transparent";
                                                                }
                                                            }}
                                                        >
                                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                                                                <span>{item.label}</span>
                                                            </div>
                                                            {active && (
                                                                <span style={{ fontSize: "12px" }}>→</span>
                                                            )}
                                                        </Link>
                                                    ) : (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "12px",
                                                                padding: "12px 16px",
                                                                color: TEXT_SECONDARY,
                                                                fontSize: "14px",
                                                            }}
                                                        >
                                                            <span style={{ fontSize: "18px" }}>{item.icon}</span>
                                                            <span>{item.label}</span>
                                                        </div>
                                                    )}

                                                    {/* Submenu */}
                                                    {hasChildren && isParentActive && (
                                                        <div style={{ marginLeft: "32px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                                            {item.children?.map((child) => {
                                                                const childActive = isActive(child.href);
                                                                return (
                                                                    child.href && (
                                                                        <Link
                                                                            key={child.href}
                                                                            href={child.href}
                                                                            style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: "12px",
                                                                                padding: "8px 16px",
                                                                                borderRadius: "6px",
                                                                                textDecoration: "none",
                                                                                color: childActive ? PRIMARY_COLOR : TEXT_TERTIARY,
                                                                                backgroundColor: childActive ? `${PRIMARY_COLOR}15` : "transparent",
                                                                                fontSize: "12px",
                                                                                fontWeight: childActive ? 500 : 400,
                                                                                transition: "all 0.2s",
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                if (!childActive) {
                                                                                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                                                                                }
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                if (!childActive) {
                                                                                    e.currentTarget.style.backgroundColor = "transparent";
                                                                                }
                                                                            }}
                                                                        >
                                                                            <span style={{ fontSize: "14px" }}>{child.icon}</span>
                                                                            <span>{child.label}</span>
                                                                        </Link>
                                                                    )
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>


                {/* User Profile */}
                <div
                    style={{
                        padding: "16px 12px",
                        borderTop: `1px solid ${BORDER_COLOR}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#E5E7EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                        }}
                    >
                        👤
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 500, color: TEXT_PRIMARY }}>
                            Admin
                        </div>
                        <div style={{ fontSize: "12px", color: TEXT_SECONDARY }}>
                            Quản trị viên
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "999px",
                            border: "none",
                            backgroundColor: "#F43F5E",
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Topbar */}
                <header
                    style={{
                        backgroundColor: "#ffffff",
                        borderBottom: `1px solid ${BORDER_COLOR}`,
                        padding: "20px 32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: 600, margin: 0, color: TEXT_PRIMARY }}>
                            Xin chào Admin 👋
                        </h1>
                    </div>
                    <div
                        style={{
                            position: "relative",
                            width: "300px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            style={{
                                width: "100%",
                                padding: "10px 16px 10px 40px",
                                border: `1px solid ${BORDER_COLOR}`,
                                borderRadius: "8px",
                                fontSize: "14px",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = PRIMARY_COLOR;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = BORDER_COLOR;
                            }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: "18px",
                                color: TEXT_TERTIARY,
                            }}
                        >
                            🔍
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, overflowY: "auto", padding: "32px", backgroundColor: BG_LIGHT }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
