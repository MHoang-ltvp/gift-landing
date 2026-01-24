"use client";

import { useEffect, useState } from "react";
import { theme } from "@/lib/theme";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 10);

        // Auto close after duration
        const timer = setTimeout(() => {
            handleClose();
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(toast.id);
        }, 300); // Match animation duration
    };

    const icons = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
    };

    const colors = {
        success: {
            bg: "#10b981",
            border: "#059669",
            text: "#ffffff",
        },
        error: {
            bg: "#ef4444",
            border: "#dc2626",
            text: "#ffffff",
        },
        warning: {
            bg: "#f59e0b",
            border: "#d97706",
            text: "#ffffff",
        },
        info: {
            bg: "#3b82f6",
            border: "#2563eb",
            text: "#ffffff",
        },
    };

    const color = colors[toast.type];

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(100%);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    @keyframes slideOutRight {
                        from {
                            opacity: 1;
                            transform: translateX(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateX(100%);
                        }
                    }
                `
            }} />
            <div
                style={{
                    backgroundColor: color.bg,
                    border: `2px solid ${color.border}`,
                    borderRadius: theme.borderRadius.lg,
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    boxShadow: theme.shadows.xl,
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.md,
                    minWidth: 300,
                    maxWidth: 500,
                    animation: isExiting ? "slideOutRight 0.3s ease-out forwards" : isVisible ? "slideInRight 0.3s ease-out forwards" : "none",
                    opacity: isVisible && !isExiting ? 1 : 0,
                    transform: isVisible && !isExiting ? "translateX(0)" : "translateX(100%)",
                    transition: "all 0.3s ease-out",
                }}
            >
                <div style={{ fontSize: 20, flexShrink: 0 }}>
                    {icons[toast.type]}
                </div>
                <div style={{ flex: 1, color: color.text, fontSize: theme.typography.fontSize.sm, fontFamily: theme.typography.fontFamily.body }}>
                    {toast.message}
                </div>
                <button
                    onClick={handleClose}
                    style={{
                        background: "none",
                        border: "none",
                        color: color.text,
                        cursor: "pointer",
                        fontSize: 20,
                        padding: 0,
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.8,
                        transition: theme.transitions.normal,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.8";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    aria-label="Đóng"
                >
                    ×
                </button>
            </div>
        </>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 80,
                right: theme.spacing.lg,
                zIndex: 10000,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.md,
                pointerEvents: "none",
            }}
        >
            {toasts.map((toast) => (
                <div key={toast.id} style={{ pointerEvents: "auto" }}>
                    <ToastItem toast={toast} onClose={onClose} />
                </div>
            ))}
        </div>
    );
}

