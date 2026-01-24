"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { theme } from "@/lib/theme";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: theme.spacing.xl,
                        backgroundColor: theme.colors.bgPrimary,
                    }}
                >
                    <div
                        style={{
                            maxWidth: 600,
                            backgroundColor: theme.colors.bgWhite,
                            borderRadius: theme.borderRadius.xl,
                            padding: theme.spacing.xxl,
                            boxShadow: theme.shadows.xl,
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: 64, marginBottom: theme.spacing.lg }}>⚠️</div>
                        <h1
                            style={{
                                fontSize: theme.typography.fontSize["2xl"],
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.textPrimary,
                                marginBottom: theme.spacing.md,
                                fontFamily: theme.typography.fontFamily.display,
                            }}
                        >
                            Đã xảy ra lỗi
                        </h1>
                        <p
                            style={{
                                fontSize: theme.typography.fontSize.md,
                                color: theme.colors.textSecondary,
                                marginBottom: theme.spacing.xl,
                                fontFamily: theme.typography.fontFamily.body,
                            }}
                        >
                            {this.state.error?.message || "Có lỗi không mong muốn xảy ra. Vui lòng thử lại sau."}
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            style={{
                                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                                backgroundColor: theme.colors.primary,
                                color: theme.colors.textWhite,
                                border: "none",
                                borderRadius: theme.borderRadius.md,
                                fontSize: theme.typography.fontSize.md,
                                fontWeight: theme.typography.fontWeight.semibold,
                                cursor: "pointer",
                                fontFamily: theme.typography.fontFamily.body,
                                transition: theme.transitions.normal,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme.colors.primary;
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            Tải lại trang
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

