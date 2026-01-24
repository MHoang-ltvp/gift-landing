"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/theme";
import { useToast } from "@/app/components/ToastContext";
import type { Settings } from "@/types";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        socialLinks: {
            instagram: { enabled: true, url: "#" },
            facebook: { enabled: true, url: "#" },
            youtube: { enabled: true, url: "#" },
            tiktok: { enabled: true, url: "#" },
        },
        googleSheets: {
            enabled: false,
            webhookUrl: "",
        },
        updatedAt: new Date().toISOString(),
    });
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    ...data,
                    updatedAt: data.updatedAt || new Date().toISOString(),
                });
            }
        } catch (error) {
            console.error("Error loading settings:", error);
            showError("Không thể tải cài đặt");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            const data = await res.json();

            if (res.ok) {
                showSuccess("Đã lưu cài đặt thành công!");
            } else {
                showError(data.error || "Không thể lưu cài đặt");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            showError("Có lỗi xảy ra khi lưu cài đặt");
        } finally {
            setSaving(false);
        }
    };

    const updateSocialLink = (platform: keyof Settings["socialLinks"], field: "enabled" | "url", value: boolean | string) => {
        setSettings((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: {
                    ...prev.socialLinks[platform],
                    [field]: value,
                },
            },
        }));
    };

    const updateGoogleSheets = (field: "enabled" | "webhookUrl", value: boolean | string) => {
        setSettings((prev) => ({
            ...prev,
            googleSheets: {
                ...prev.googleSheets,
                [field]: value,
            },
        }));
    };

    if (loading) {
        return (
            <main style={{ padding: 24, fontFamily: theme.typography.fontFamily.body, backgroundColor: theme.colors.bgPrimary, minHeight: "100vh" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", padding: theme.spacing.xxxl }}>
                    <p style={{ color: theme.colors.textSecondary }}>Đang tải...</p>
                </div>
            </main>
        );
    }

    const socialPlatforms: Array<{
        key: keyof Settings["socialLinks"];
        label: string;
        icon: string;
        color: string;
    }> = [
        { key: "instagram", label: "Instagram", icon: "📷", color: "#E4405F" },
        { key: "facebook", label: "Facebook", icon: "👥", color: "#1877F2" },
        { key: "youtube", label: "YouTube", icon: "📺", color: "#FF0000" },
        { key: "tiktok", label: "TikTok", icon: "🎵", color: "#000000" },
    ];

    return (
        <main style={{ padding: 24, fontFamily: theme.typography.fontFamily.body, backgroundColor: theme.colors.bgPrimary, minHeight: "100vh" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <a
                        href="/admin"
                        style={{
                            color: theme.colors.primary,
                            textDecoration: "none",
                            fontSize: theme.typography.fontSize.sm,
                            marginBottom: 16,
                            display: "inline-block",
                        }}
                    >
                        ← Về Admin
                    </a>
                    <h1
                        style={{
                            fontSize: theme.typography.fontSize["4xl"],
                            fontWeight: theme.typography.fontWeight.bold,
                            color: theme.colors.textPrimary,
                            fontFamily: theme.typography.fontFamily.display,
                            marginBottom: 8,
                        }}
                    >
                        ⚙️ Cài Đặt Hệ Thống
                    </h1>
                </div>

                {/* Social Media Links Section */}
                <div
                    style={{
                        backgroundColor: theme.colors.bgWhite,
                        borderRadius: theme.borderRadius.xl,
                        boxShadow: theme.shadows.lg,
                        padding: theme.spacing.xl,
                        marginBottom: theme.spacing.xl,
                    }}
                >
                    <h2
                        style={{
                            fontSize: theme.typography.fontSize.xl,
                            fontWeight: theme.typography.fontWeight.bold,
                            color: theme.colors.textPrimary,
                            marginBottom: theme.spacing.lg,
                            fontFamily: theme.typography.fontFamily.display,
                        }}
                    >
                        🔗 Liên Kết Mạng Xã Hội
                    </h2>
                    <p
                        style={{
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.textSecondary,
                            marginBottom: theme.spacing.lg,
                        }}
                    >
                        Bật/tắt và cấu hình URL cho các mạng xã hội. Chỉ các mạng xã hội được bật mới hiển thị trên trang chủ.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.lg }}>
                        {socialPlatforms.map((platform) => {
                            const currentLink = settings.socialLinks[platform.key];
                            return (
                                <div
                                    key={platform.key}
                                    style={{
                                        padding: theme.spacing.lg,
                                        border: `2px solid ${theme.colors.borderLight}`,
                                        borderRadius: theme.borderRadius.lg,
                                        backgroundColor: currentLink?.enabled ? theme.colors.bgPrimary : theme.colors.bgGray,
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
                                        <div style={{ fontSize: 32 }}>{platform.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <h3
                                                style={{
                                                    fontSize: theme.typography.fontSize.md,
                                                    fontWeight: theme.typography.fontWeight.semibold,
                                                    color: theme.colors.textPrimary,
                                                    marginBottom: theme.spacing.xs,
                                                }}
                                            >
                                                {platform.label}
                                            </h3>
                                        </div>
                                        <label
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: theme.spacing.sm,
                                                cursor: "pointer",
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={currentLink?.enabled ?? false}
                                                onChange={(e) => updateSocialLink(platform.key, "enabled", e.target.checked)}
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    cursor: "pointer",
                                                }}
                                            />
                                            <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary }}>
                                                {currentLink?.enabled ? "Hiển thị" : "Ẩn"}
                                            </span>
                                        </label>
                                    </div>
                                    {currentLink?.enabled && (
                                        <div>
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontSize: theme.typography.fontSize.sm,
                                                    fontWeight: theme.typography.fontWeight.medium,
                                                    color: theme.colors.textPrimary,
                                                    marginBottom: theme.spacing.sm,
                                                }}
                                            >
                                                URL {platform.label}
                                            </label>
                                            <input
                                                type="url"
                                                value={currentLink.url || ""}
                                                onChange={(e) => updateSocialLink(platform.key, "url", e.target.value)}
                                                placeholder={`https://${platform.key}.com/your-profile`}
                                                style={{
                                                    width: "100%",
                                                    padding: theme.spacing.md,
                                                    borderRadius: theme.borderRadius.md,
                                                    border: `2px solid ${theme.colors.borderMedium}`,
                                                    fontSize: theme.typography.fontSize.sm,
                                                    outline: "none",
                                                    fontFamily: theme.typography.fontFamily.body,
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = theme.colors.primary;
                                                    e.currentTarget.style.boxShadow = theme.shadows.sm;
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = theme.colors.borderMedium;
                                                    e.currentTarget.style.boxShadow = "none";
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Google Sheets Integration Section */}
                <div
                    style={{
                        backgroundColor: theme.colors.bgWhite,
                        borderRadius: theme.borderRadius.xl,
                        boxShadow: theme.shadows.lg,
                        padding: theme.spacing.xl,
                        marginBottom: theme.spacing.xl,
                    }}
                >
                    <h2
                        style={{
                            fontSize: theme.typography.fontSize.xl,
                            fontWeight: theme.typography.fontWeight.bold,
                            color: theme.colors.textPrimary,
                            marginBottom: theme.spacing.lg,
                            fontFamily: theme.typography.fontFamily.display,
                        }}
                    >
                        📊 Tích Hợp Google Sheets
                    </h2>
                    <p
                        style={{
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.textSecondary,
                            marginBottom: theme.spacing.lg,
                        }}
                    >
                        Tự động gửi dữ liệu lead về Google Sheets khi khách hàng điền form.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: theme.spacing.sm,
                                cursor: "pointer",
                                padding: theme.spacing.md,
                                border: `2px solid ${theme.colors.borderLight}`,
                                borderRadius: theme.borderRadius.lg,
                                backgroundColor: settings.googleSheets?.enabled ? theme.colors.bgPrimary : theme.colors.bgGray,
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={settings.googleSheets?.enabled ?? false}
                                onChange={(e) => updateGoogleSheets("enabled", e.target.checked)}
                                style={{
                                    width: 20,
                                    height: 20,
                                    cursor: "pointer",
                                }}
                            />
                            <span style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.textPrimary }}>
                                Bật tích hợp Google Sheets
                            </span>
                        </label>

                        {settings.googleSheets?.enabled && (
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: theme.typography.fontSize.sm,
                                        fontWeight: theme.typography.fontWeight.medium,
                                        color: theme.colors.textPrimary,
                                        marginBottom: theme.spacing.sm,
                                    }}
                                >
                                    Webhook URL (Google Apps Script)
                                </label>
                                <input
                                    type="url"
                                    value={settings.googleSheets?.webhookUrl || ""}
                                    onChange={(e) => updateGoogleSheets("webhookUrl", e.target.value)}
                                    placeholder="https://script.google.com/macros/s/..."
                                    style={{
                                        width: "100%",
                                        padding: theme.spacing.md,
                                        borderRadius: theme.borderRadius.md,
                                        border: `2px solid ${theme.colors.borderMedium}`,
                                        fontSize: theme.typography.fontSize.sm,
                                        outline: "none",
                                        fontFamily: theme.typography.fontFamily.body,
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = theme.colors.primary;
                                        e.currentTarget.style.boxShadow = theme.shadows.sm;
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = theme.colors.borderMedium;
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                />
                                <p
                                    style={{
                                        fontSize: theme.typography.fontSize.xs,
                                        color: theme.colors.textTertiary,
                                        marginTop: theme.spacing.sm,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    💡 Xem hướng dẫn chi tiết trong file <code style={{ backgroundColor: theme.colors.bgGray, padding: "2px 6px", borderRadius: 4 }}>GOOGLE_SHEETS_SETUP.md</code>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: theme.spacing.md }}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                            color: theme.colors.textWhite,
                            fontWeight: theme.typography.fontWeight.semibold,
                            borderRadius: theme.borderRadius.xl,
                            border: "none",
                            cursor: saving ? "not-allowed" : "pointer",
                            boxShadow: theme.shadows.lg,
                            transition: theme.transitions.normal,
                            opacity: saving ? 0.7 : 1,
                            fontSize: theme.typography.fontSize.md,
                        }}
                        onMouseEnter={(e) => {
                            if (!saving) {
                                e.currentTarget.style.transform = "scale(1.02)";
                                e.currentTarget.style.boxShadow = theme.shadows.xl;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = theme.shadows.lg;
                        }}
                    >
                        {saving ? "Đang lưu..." : "💾 Lưu Cài Đặt"}
                    </button>
                </div>
            </div>
        </main>
    );
}

