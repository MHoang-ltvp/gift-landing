"use client";

import { theme } from "@/lib/theme";

export default function HeroBanner() {
    const scrollToProducts = () => {
        const firstSection = document.getElementById("tet");
        if (firstSection) {
            const headerOffset = 80;
            const elementPosition = firstSection.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(40px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(0.9);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-15px);
                        }
                    }
                    @keyframes shimmer {
                        0% {
                            background-position: -200% center;
                        }
                        100% {
                            background-position: 200% center;
                        }
                    }
                    .slide-up {
                        animation: slideUp 1s ease-out forwards;
                        opacity: 0;
                    }
                    .slide-up-delay-1 {
                        animation: slideUp 1s ease-out 0.3s forwards;
                        opacity: 0;
                    }
                    .slide-up-delay-2 {
                        animation: slideUp 1s ease-out 0.6s forwards;
                        opacity: 0;
                    }
                    .fade-in {
                        animation: fadeIn 1.2s ease-out forwards;
                        opacity: 0;
                    }
                    .scale-in {
                        animation: scaleIn 0.8s ease-out forwards;
                        opacity: 0;
                    }
                    .float-animation {
                        animation: float 3s ease-in-out infinite;
                    }
                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                        background-size: 200% 100%;
                        animation: shimmer 2s infinite;
                    }
                `
            }} />
            <section
                style={{
                    padding: `${theme.spacing.xxxl} ${theme.spacing.lg}`,
                    backgroundColor: theme.colors.bgWhite,
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "70% 1fr",
                            gap: theme.spacing.lg,
                            height: 400,
                        }}
                        className="slide-up"
                    >
                        {/* PHẦN TRÁI - Banner lớn (70%) */}
                        <div
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                                borderRadius: theme.borderRadius.xl,
                                overflow: "hidden",
                                boxShadow: theme.shadows.xl,
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                padding: theme.spacing.xl,
                            }}
                            className="slide-up-delay-1"
                        >
                            {/* Pattern overlay */}
                            <div style={{ position: "absolute", inset: 0, opacity: 0.2 }}>
                                <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%" }}>
                                    <defs>
                                        <pattern id="dots" x="40" y="40" width="80" height="80" patternUnits="userSpaceOnUse">
                                            <circle cx="10" cy="10" r="3" fill="#fff" opacity="0.3" />
                                        </pattern>
                                    </defs>
                                    <rect width="400" height="300" fill="url(#dots)" />
                                </svg>
                            </div>

                            {/* Content */}
                            <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                {/* Left Text */}
                                <div style={{ flex: "1 1 50%" }}>
                                    <h1
                                        className="fade-in"
                                        style={{
                                            fontSize: "clamp(32px, 5vw, 48px)",
                                            fontWeight: theme.typography.fontWeight.bold,
                                            color: theme.colors.textWhite,
                                            marginBottom: theme.spacing.md,
                                            lineHeight: 1.2,
                                            fontFamily: theme.typography.fontFamily.display,
                                            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        Gửi Tình Cảm, Gửi Tình Yêu
                                    </h1>
                                    <p
                                        className="fade-in"
                                        style={{
                                            fontSize: "clamp(16px, 2vw, 20px)",
                                            color: theme.colors.textWhite,
                                            marginBottom: theme.spacing.xl,
                                            opacity: 0.95,
                                            lineHeight: 1.6,
                                            fontFamily: theme.typography.fontFamily.body,
                                            animationDelay: "0.2s",
                                        }}
                                    >
                                        Những bộ sưu tập quà tặng được chọn lọc tỉ mỉ cho mỗi dịp đặc biệt
                                    </p>
                                    <button
                                        onClick={scrollToProducts}
                                        style={{
                                            backgroundColor: theme.colors.bgWhite,
                                            color: theme.colors.primary,
                                            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                                            borderRadius: theme.borderRadius.md,
                                            border: "none",
                                            fontSize: theme.typography.fontSize.md,
                                            fontWeight: theme.typography.fontWeight.bold,
                                            cursor: "pointer",
                                            transition: theme.transitions.normal,
                                            fontFamily: theme.typography.fontFamily.body,
                                            boxShadow: theme.shadows.md,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: theme.spacing.sm,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "scale(1.05)";
                                            e.currentTarget.style.boxShadow = theme.shadows.lg;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "scale(1)";
                                            e.currentTarget.style.boxShadow = theme.shadows.md;
                                        }}
                                    >
                                        Khám Phá Ngay →
                                    </button>
                                </div>

                                {/* Right Illustration */}
                                <div className="float-animation" style={{ flex: "1 1 50%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                    <svg viewBox="0 0 300 300" style={{ width: "80%", height: "80%", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.2))" }}>
                                        {/* Main Large Gift Box */}
                                        <rect x="40" y="80" width="140" height="140" rx="15" fill="#FFD700" />
                                        <rect x="40" y="80" width="140" height="140" rx="15" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
                                        {/* Ribbon Vertical */}
                                        <rect x="105" y="80" width="30" height="140" fill="#fff" opacity="0.9" />
                                        {/* Ribbon Horizontal */}
                                        <rect x="40" y="145" width="140" height="25" fill="#fff" opacity="0.9" />
                                        {/* Bow */}
                                        <circle cx="75" cy="60" r="22" fill="#fff" opacity="0.8" />
                                        <circle cx="125" cy="60" r="22" fill="#fff" opacity="0.8" />
                                        <circle cx="100" cy="75" r="16" fill="#FFD700" />
                                        {/* Floating small boxes */}
                                        <g opacity="0.9">
                                            <rect x="180" y="100" width="70" height="70" rx="8" fill="#FF6B6B" />
                                            <rect x="180" y="100" width="70" height="70" rx="8" fill="none" stroke="#fff" strokeWidth="2" />
                                            <text x="215" y="145" fontSize="40" textAnchor="middle" fill="#fff">💝</text>
                                        </g>
                                        {/* Small heart accents */}
                                        <g opacity="0.8">
                                            <path d="M240 180 C240 175 245 172 250 180 C255 172 260 175 260 180 C260 190 250 200 250 200 C250 200 240 190 240 180" fill="#fff" />
                                            <path d="M50 200 C50 195 55 192 60 200 C65 192 70 195 70 200 C70 210 60 220 60 220 C60 220 50 210 50 200" fill="#FFD700" />
                                        </g>
                                        {/* Stars */}
                                        <g fill="#fff" opacity="0.7">
                                            <polygon points="270,120 275,135 290,135 278,145 283,160 270,150 257,160 262,145 250,135 265,135" />
                                            <polygon points="60,50 63,60 75,60 65,68 68,78 60,72 52,78 55,68 45,60 57,60" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* PHẦN PHẢI - 2 Banner nhỏ dọc (30%) */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: theme.spacing.lg,
                            }}
                            className="slide-up-delay-2"
                        >
                            {/* Banner con 1 */}
                            <div
                                style={{
                                    flex: 1,
                                    background: `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, ${theme.colors.bgSecondary} 100%)`,
                                    borderRadius: theme.borderRadius.xl,
                                    overflow: "hidden",
                                    boxShadow: theme.shadows.lg,
                                    padding: theme.spacing.lg,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: theme.typography.fontSize.xl,
                                        fontWeight: theme.typography.fontWeight.bold,
                                        color: theme.colors.textPrimary,
                                        marginBottom: theme.spacing.sm,
                                        fontFamily: theme.typography.fontFamily.display,
                                    }}
                                >
                                    Quà cho từng khoảnh khắc
                                </h3>
                                <p
                                    style={{
                                        fontSize: theme.typography.fontSize.sm,
                                        color: theme.colors.textSecondary,
                                        lineHeight: 1.6,
                                        fontFamily: theme.typography.fontFamily.body,
                                        textAlign: "left",
                                    }}
                                >
                                    <span style={{ display: "block" }}>Từ giỏ quà trang trọng</span>
                                    <span style={{ display: "block" }}>đến món quà nhỏ đầy tinh tế.</span>
                                </p>
                            </div>

                            {/* Banner con 2 */}
                            <div
                                style={{
                                    flex: 1,
                                    background: `linear-gradient(135deg, ${theme.colors.bgSecondary} 0%, ${theme.colors.bgTertiary} 100%)`,
                                    borderRadius: theme.borderRadius.xl,
                                    overflow: "hidden",
                                    boxShadow: theme.shadows.lg,
                                    padding: theme.spacing.lg,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: theme.typography.fontSize.xl,
                                        fontWeight: theme.typography.fontWeight.bold,
                                        color: theme.colors.textPrimary,
                                        marginBottom: theme.spacing.sm,
                                        fontFamily: theme.typography.fontFamily.display,
                                        lineHeight: 1.3,
                                    }}
                                >
                                    Một tấm thiệp cho riêng bạn
                                </h3>
                                <p
                                    style={{
                                        fontSize: theme.typography.fontSize.sm,
                                        color: theme.colors.textSecondary,
                                        lineHeight: 1.5,
                                        fontFamily: theme.typography.fontFamily.body,
                                        margin: 0,
                                        textAlign: "left",
                                    }}
                                >
                                    <span style={{ display: "block" }}>Vì mỗi món quà đều xứng đáng</span>
                                    <span style={{ display: "block" }}>có câu chuyện của riêng mình.</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: theme.spacing.lg,
                            fontSize: theme.typography.fontSize.md,
                            color: theme.colors.textSecondary,
                            fontStyle: "italic",
                            fontFamily: theme.typography.fontFamily.body,
                        }}
                        className="slide-up-delay-2"
                    >
                        "Quà lớn cho Tết – Quà nhỏ cho yêu thương."
                    </div>
                </div>

                {/* Responsive: Mobile stack */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @media (max-width: 768px) {
                            section > div > div:first-child {
                                grid-template-columns: 1fr !important;
                                height: auto !important;
                            }
                            section > div > div:first-child > div:first-child {
                                height: 300px !important;
                            }
                            section > div > div:first-child > div:last-child {
                                height: auto !important;
                            }
                            section > div > div:first-child > div:last-child > div {
                                min-height: 150px !important;
                            }
                        }
                    `
                }} />
            </section>
        </>
    );
}
