"use client";

import { useState, useEffect, useRef } from "react";
import { theme } from "@/lib/theme";
import { useToast } from "./ToastContext";

export default function LeadForm() {
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(40px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(40px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    .form-fade-in {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                    .form-slide-right {
                        animation: slideInRight 0.8s ease-out forwards;
                    }
                `
            }} />
            <section
                ref={sectionRef}
                style={{
                    padding: `${theme.spacing.xxxl} ${theme.spacing.lg}`,
                    background: `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, ${theme.colors.bgSecondary} 100%)`,
                }}
            >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: theme.spacing.xl,
                    alignItems: "center",
                }}
            >
                {/* Left Content */}
                <div className={isVisible ? "form-fade-in" : ""}>
                    <h2
                        style={{
                            fontSize: "clamp(32px, 5vw, 42px)",
                            fontWeight: theme.typography.fontWeight.bold,
                            marginBottom: theme.spacing.md,
                            color: theme.colors.textPrimary,
                            lineHeight: 1.2,
                            fontFamily: theme.typography.fontFamily.display,
                        }}
                    >
                        Để lại thông tin để nhận tư vấn
                    </h2>
                    <p
                        style={{
                            fontSize: "clamp(16px, 2vw, 20px)",
                            color: theme.colors.textSecondary,
                            marginBottom: theme.spacing.lg,
                            lineHeight: 1.6,
                            fontFamily: theme.typography.fontFamily.body,
                        }}
                    >
                        Chúng tôi sẽ liên hệ với bạn sớm nhất có thể để tư vấn về các sản phẩm quà tặng phù hợp nhất.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: theme.spacing.md,
                        }}
                    >
                        {[
                            { text: "Tư vấn miễn phí 24/7", icon: "💬" },
                            { text: "Giao hàng nhanh chóng", icon: "🚚" },
                            { text: "Đảm bảo chất lượng", icon: "⭐" },
                        ].map((item, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", gap: theme.spacing.md }}>
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: theme.colors.textWhite,
                                        fontSize: 24,
                                        boxShadow: theme.shadows.md,
                                        flexShrink: 0,
                                    }}
                                >
                                    {item.icon}
                                </div>
                                <span style={{ fontSize: theme.typography.fontSize.md, color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamily.body, fontWeight: theme.typography.fontWeight.medium }}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Form */}
                <div
                    style={{
                        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
                        padding: theme.spacing.xl,
                        borderRadius: theme.borderRadius.lg,
                        color: theme.colors.textWhite,
                        boxShadow: theme.shadows.xl,
                    }}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            @keyframes fadeIn {
                                from {
                                    opacity: 0;
                                    transform: translateY(-10px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                        `
                    }} />
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setLoading(true);

                            const form = e.currentTarget;

                            try {
                                const fd = new FormData(form);
                                const phone = fd.get("phone")?.toString().trim() || "";
                                const email = fd.get("email")?.toString().trim() || "";

                                // Validation: Cả phone và email đều bắt buộc
                                if (!phone) {
                                    showError("Vui lòng nhập số điện thoại");
                                    setLoading(false);
                                    return;
                                }

                                if (!email) {
                                    showError("Vui lòng nhập email");
                                    setLoading(false);
                                    return;
                                }

                                // Validation: Phone format (VN: 10 số, bắt đầu bằng 0 hoặc +84)
                                const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
                                const phoneNormalized = phone.replace(/\s+/g, ""); // Remove spaces
                                if (!phoneRegex.test(phoneNormalized)) {
                                    showError("Số điện thoại không đúng định dạng. Vui lòng nhập số điện thoại Việt Nam (ví dụ: 0968118025 hoặc +84968118025)");
                                    setLoading(false);
                                    return;
                                }

                                // Validation: Email format
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!emailRegex.test(email)) {
                                    showError("Email không đúng định dạng. Vui lòng nhập email hợp lệ (ví dụ: example@gmail.com)");
                                    setLoading(false);
                                    return;
                                }

                                const body = Object.fromEntries(fd.entries());

                                const res = await fetch("/api/leads", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(body),
                                });

                                const data = await res.json().catch(() => ({}));

                                if (res.ok) {
                                    form.reset();
                                    showSuccess("Đã gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.");
                                } else {
                                    console.error("API Error:", data);
                                    showError(data.error || `Gửi thất bại (${res.status}). Vui lòng thử lại.`);
                                }
                            } catch (error) {
                                console.error("Form submission error:", error);
                                showError(error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại.");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        {[
                            { name: "name", label: "Tên", type: "text", placeholder: "Nhập tên của bạn", required: false },
                            { name: "phone", label: "Số điện thoại *", type: "tel", placeholder: "Ví dụ: 0968118025 hoặc +84968118025", required: true },
                            { name: "email", label: "Email *", type: "email", placeholder: "Ví dụ: example@gmail.com", required: true },
                        ].map((field) => (
                            <div key={field.name} style={{ marginBottom: theme.spacing.md }}>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: theme.spacing.sm,
                                        fontSize: theme.typography.fontSize.sm,
                                        fontWeight: theme.typography.fontWeight.medium,
                                        fontFamily: theme.typography.fontFamily.body,
                                    }}
                                >
                                    {field.label}
                                </label>
                                <input
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    style={{
                                        width: "100%",
                                        padding: theme.spacing.md,
                                        border: "none",
                                        borderRadius: theme.borderRadius.md,
                                        fontSize: theme.typography.fontSize.sm,
                                        outline: "none",
                                        fontFamily: theme.typography.fontFamily.body,
                                    }}
                                />
                            </div>
                        ))}

                        <div style={{ marginBottom: theme.spacing.md }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: theme.spacing.sm,
                                    fontSize: theme.typography.fontSize.sm,
                                    fontWeight: theme.typography.fontWeight.medium,
                                    fontFamily: theme.typography.fontFamily.body,
                                }}
                            >
                                Dịp quan tâm
                            </label>
                            <select
                                name="occasion"
                                style={{
                                    width: "100%",
                                    padding: theme.spacing.md,
                                    border: "none",
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: theme.typography.fontSize.sm,
                                    outline: "none",
                                    fontFamily: theme.typography.fontFamily.body,
                                }}
                            >
                                <option value="">Chọn dịp quan tâm (tùy chọn)</option>
                                <option value="tet">Tết</option>
                                <option value="valentine">Valentine</option>
                                <option value="8-3">8/3</option>
                            </select>
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                                backgroundColor: theme.colors.bgWhite,
                                color: theme.colors.primary,
                                border: "none",
                                borderRadius: theme.borderRadius.md,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontSize: theme.typography.fontSize.md,
                                fontWeight: theme.typography.fontWeight.semibold,
                                transition: theme.transitions.normal,
                                fontFamily: theme.typography.fontFamily.body,
                                opacity: loading ? 0.7 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            {loading ? "Đang gửi..." : "Gửi thông tin"}
                        </button>

                        <p style={{ marginTop: theme.spacing.md, fontSize: theme.typography.fontSize.xs, opacity: 0.9, textAlign: "center", fontFamily: theme.typography.fontFamily.body }}>
                            * Số điện thoại và Email đều bắt buộc. SĐT phải đúng định dạng Việt Nam (10 số, bắt đầu bằng 0 hoặc +84)
                        </p>
                    </form>
                </div>
            </div>
        </section>
        </>
    );
}
