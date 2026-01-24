"use client";

import { theme } from "@/lib/theme";

interface AdminCardProps {
    href: string;
    title: string;
    description: string;
    color: string;
    icon?: string;
}

export default function AdminCard({ href, title, description, color, icon = "📋" }: AdminCardProps) {
    return (
        <a
            href={href}
            className="admin-card"
            style={{
                padding: theme.spacing.xl,
                border: `2px solid ${color}`,
                borderRadius: theme.borderRadius.xl,
                textDecoration: "none",
                color: "inherit",
                display: "block",
                backgroundColor: theme.colors.bgWhite,
                transition: theme.transitions.slow,
                boxShadow: theme.shadows.md,
                position: "relative",
                overflow: "hidden",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = theme.shadows.xl;
                e.currentTarget.style.borderColor = color;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.shadows.md;
                e.currentTarget.style.borderColor = color;
            }}
        >
            {/* Background gradient accent */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 120,
                    height: 120,
                    background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                    borderRadius: "0 0 0 100%",
                    pointerEvents: "none",
                }}
            />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Icon */}
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: theme.borderRadius.lg,
                        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 32,
                        marginBottom: theme.spacing.md,
                        boxShadow: theme.shadows.md,
                    }}
                >
                    {icon}
                </div>

                {/* Title */}
                <h2
                    style={{
                        margin: `0 0 ${theme.spacing.sm} 0`,
                        color: color,
                        fontSize: theme.typography.fontSize["2xl"],
                        fontWeight: theme.typography.fontWeight.bold,
                        fontFamily: theme.typography.fontFamily.display,
                    }}
                >
                    {title}
                </h2>

                {/* Description */}
                <p
                    style={{
                        margin: 0,
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.md,
                        lineHeight: 1.6,
                        fontFamily: theme.typography.fontFamily.body,
                    }}
                >
                    {description}
                </p>

                {/* Arrow indicator */}
                <div
                    style={{
                        marginTop: theme.spacing.lg,
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing.xs,
                        color: color,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                    }}
                >
                    <span>Xem chi tiết</span>
                    <span>→</span>
                </div>
            </div>
        </a>
    );
}

