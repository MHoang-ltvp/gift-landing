"use client";

import type { CardOccasion } from "@/types";

interface CardPreviewProps {
    occasion: CardOccasion;
    recipient: string;
    sender: string;
    message: string;
    personalImageUrl?: string; // URL ảnh cá nhân (ảnh dọc) hiển thị trong thiệp
}

const themes = {
    newyear: {
        gradient: "linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)",
        accent: "#fbbf24",
        icon: "🎆",
        title: "CHÚC MỪNG NĂM MỚI",
        decorations: ["🧧", "🎊", "🏮", "✨", "🎇"],
    },
    valentine: {
        gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)",
        accent: "#fff",
        icon: "💕",
        title: "HAPPY VALENTINE",
        decorations: ["💖", "💝", "💗", "❤️", "💘"],
    },
    womensday: {
        gradient: "linear-gradient(180deg, #ffb3d9 0%, #ff4d6d 30%, #ff4d6d 50%, #ffe5e5 100%)",
        accent: "#fff",
        icon: "🌸",
        title: "HAPPY Women's Day",
        decorations: ["🌷", "🌺", "🌹", "💐", "🌻"],
    },
};

export default function CardPreview({ occasion, recipient, sender, message, personalImageUrl }: CardPreviewProps) {
    const theme = themes[occasion];
    const displayRecipient = recipient || "Người thân yêu";
    const displaySender = sender || "Người gửi";
    const displayMessage = message || "Lời chúc của bạn sẽ hiển thị ở đây...";

    // Special design for Valentine's Day
    if (occasion === "valentine") {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #f9a8d4 60%, #f472b6 100%)",
                    position: "relative",
                    overflow: "auto",
                    borderRadius: 16,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                        }
                        @keyframes sparkle {
                            0%, 100% { opacity: 0.4; transform: scale(0.8); }
                            50% { opacity: 0.9; transform: scale(1.2); }
                        }
                        @keyframes heartbeat {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.1); }
                        }
                        @keyframes titleSlideIn {
                            0% {
                                opacity: 0;
                                transform: translateY(-30px) scale(0.9);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }
                        @keyframes pinkShine {
                            0% {
                                background-position: -200% center;
                            }
                            100% {
                                background-position: 200% center;
                            }
                        }
                        .float-animation {
                            animation: float 3s ease-in-out infinite;
                        }
                        .sparkle {
                            animation: sparkle 2s ease-in-out infinite;
                        }
                        .heartbeat {
                            animation: heartbeat 1.5s ease-in-out infinite;
                        }
                        .title-animation {
                            animation: titleSlideIn 1s ease-out forwards;
                        }
                        .pink-shine {
                            position: relative;
                            display: inline-block;
                        }
                        .pink-shine::after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: -100%;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                            animation: pinkShine 2.5s ease-in-out 1s infinite;
                        }
                    `
                }} />

                {/* Background Pattern - Diagonal lines */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 10px,
                            rgba(255, 182, 193, 0.1) 10px,
                            rgba(255, 182, 193, 0.1) 20px
                        )`,
                        opacity: 0.3,
                        zIndex: 1,
                    }}
                />

                {/* Floating Hearts */}
                <div style={{ position: "absolute", top: 20, left: 30, fontSize: 28, opacity: 0.4, zIndex: 2 }}>
                    <span className="float-animation heartbeat" style={{ animationDelay: "0s" }}>💖</span>
                </div>
                <div style={{ position: "absolute", top: 60, right: 40, fontSize: 32, opacity: 0.35, zIndex: 2 }}>
                    <span className="float-animation heartbeat" style={{ animationDelay: "0.5s" }}>💕</span>
                </div>
                <div style={{ position: "absolute", top: 100, left: 50, fontSize: 24, opacity: 0.3, zIndex: 2 }}>
                    <span className="sparkle" style={{ animationDelay: "1s" }}>💗</span>
                </div>

                {/* Top Section - Title */}
                <div style={{ position: "relative", padding: "20px 20px 0px", textAlign: "center", zIndex: 10, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "30%" }}>
                    {/* Decorative hearts */}
                    <div style={{ position: "absolute", top: 16, left: 20, fontSize: 18, opacity: 0.6 }}>
                        <span className="sparkle heartbeat" style={{ animationDelay: "0s" }}>💝</span>
                    </div>
                    <div style={{ position: "absolute", top: 14, right: 24, fontSize: 16, opacity: 0.5 }}>
                        <span className="sparkle heartbeat" style={{ animationDelay: "0.5s" }}>💘</span>
                    </div>

                    {/* Title */}
                    <div style={{ color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div
                            className="title-animation pink-shine"
                            style={{
                                fontSize: "clamp(24px, 3.5vw, 36px)",
                                fontWeight: 400,
                                letterSpacing: "3px",
                                marginBottom: 4,
                                fontFamily: "'Great Vibes', cursive",
                                textTransform: "none",
                                color: "#fff",
                                textShadow: "3px 3px 8px rgba(219, 39, 119, 0.5), 0 0 20px rgba(255,255,255,0.3)",
                                position: "relative",
                            }}
                        >
                            Happy
                        </div>
                        <div
                            className="title-animation"
                            style={{
                                fontSize: "clamp(40px, 6vw, 72px)",
                                fontWeight: 400,
                                letterSpacing: "2px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                fontFamily: "'Great Vibes', cursive",
                                lineHeight: 1.1,
                                color: "#fff",
                                textShadow: "3px 3px 8px rgba(219, 39, 119, 0.5), 0 0 20px rgba(255,255,255,0.3)",
                            }}
                        >
                            <span>Valentine's</span>
                            <span style={{ fontSize: "0.95em" }}>Day</span>
                            <span style={{ fontSize: "0.6em", marginLeft: 6, opacity: 0.9 }}>💝</span>
                        </div>
                    </div>
                </div>

                {/* Personal Image Section - Between Title and Message Box */}
                {personalImageUrl && (
                    <div style={{
                        position: "relative",
                        padding: "4px 20px",
                        marginTop: "-40px",
                        marginBottom: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                        zIndex: 5,
                    }}>
                        <img
                            src={personalImageUrl}
                            alt="Personal"
                            style={{
                                width: "195px",
                                height: "285px",
                                objectFit: "cover",
                                borderRadius: "12px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            }}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    </div>
                )}

                {/* Bottom Section - Message Box */}
                <div style={{ flex: 1, position: "relative", padding: "0 20px 20px", minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                    {/* Message Box - Stamp style với viền răng cưa */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #fff8f0 0%, #fff5e6 100%)",
                            borderRadius: 16,
                            padding: "18px 16px",
                            boxShadow: "0 8px 24px rgba(219, 39, 119, 0.3)",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            border: "3px dashed rgba(236, 72, 153, 0.4)",
                            overflow: "hidden",
                            maxWidth: "92%",
                            margin: "0 auto",
                            width: "100%",
                            minHeight: "200px",
                            maxHeight: "calc(100% - 20px)",
                        }}
                    >
                        {/* Perforated edge effect (stamp style) */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "12px",
                                border: "2px solid transparent",
                                background: `
                                    radial-gradient(circle at 0 0, transparent 4px, rgba(236, 72, 153, 0.2) 4px, rgba(236, 72, 153, 0.2) 6px, transparent 6px),
                                    radial-gradient(circle at 100% 0, transparent 4px, rgba(236, 72, 153, 0.2) 4px, rgba(236, 72, 153, 0.2) 6px, transparent 6px),
                                    radial-gradient(circle at 0 100%, transparent 4px, rgba(236, 72, 153, 0.2) 4px, rgba(236, 72, 153, 0.2) 6px, transparent 6px),
                                    radial-gradient(circle at 100% 100%, transparent 4px, rgba(236, 72, 153, 0.2) 4px, rgba(236, 72, 153, 0.2) 6px, transparent 6px)
                                `,
                                backgroundSize: "20px 20px",
                                backgroundPosition: "0 0, 100% 0, 0 100%, 100% 100%",
                                backgroundRepeat: "no-repeat",
                                pointerEvents: "none",
                                zIndex: 1,
                            }}
                        />

                        {/* Pink Banner */}
                        <div
                            style={{
                                background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                                color: "#fff",
                                padding: "8px 12px",
                                borderRadius: "8px 8px 0 0",
                                margin: "-18px -16px 12px -16px",
                                textAlign: "center",
                                fontWeight: 700,
                                fontSize: "clamp(12px, 1.6vw, 16px)",
                                letterSpacing: "1px",
                                boxShadow: "0 2px 8px rgba(219, 39, 119, 0.3)",
                                borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
                                position: "relative",
                                zIndex: 2,
                            }}
                        >
                            HAPPY VALENTINE'S DAY
                        </div>

                        {/* Content */}
                        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 8, height: "100%", minHeight: 0 }}>
                            {/* Message - Scrollable area */}
                            <div
                                style={{
                                    flex: 1,
                                    fontSize: "clamp(10px, 1.3vw, 14px)",
                                    color: "#7f1d1d",
                                    lineHeight: 1.6,
                                    textAlign: "center",
                                    fontFamily: "'Be Vietnam Pro', sans-serif",
                                    padding: "8px 6px",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    minHeight: 0,
                                    maxHeight: "none",
                                }}
                            >
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                        div[style*="overflowY: auto"]::-webkit-scrollbar {
                                            width: 6px;
                                        }
                                        div[style*="overflowY: auto"]::-webkit-scrollbar-track {
                                            background: rgba(236, 72, 153, 0.2);
                                            border-radius: 3px;
                                        }
                                        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
                                            background: rgba(219, 39, 119, 0.4);
                                            border-radius: 3px;
                                        }
                                        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
                                            background: rgba(219, 39, 119, 0.6);
                                        }
                                    `
                                }} />
                                {displayMessage}
                            </div>

                            {/* Recipient và Sender */}
                            <div style={{ flexShrink: 0, paddingTop: 6, borderTop: "2px dashed rgba(236, 72, 153, 0.3)", marginTop: 4 }}>
                                {displayRecipient && (
                                    <div
                                        style={{
                                            fontSize: "clamp(8px, 1vw, 11px)",
                                            color: "#db2777",
                                            fontWeight: 600,
                                            marginBottom: 2,
                                            textAlign: "left",
                                        }}
                                    >
                                        Gửi đến: <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.1em", fontStyle: "italic" }}>{displayRecipient}</span>
                                    </div>
                                )}
                                {displaySender && (
                                    <div
                                        style={{
                                            fontSize: "clamp(8px, 1.1vw, 12px)",
                                            color: "#be185d",
                                            textAlign: "right",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        — {displaySender}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements - Arrow through heart, envelope */}
                <div style={{ position: "absolute", bottom: 12, left: 16, fontSize: 24, opacity: 0.5, zIndex: 1, transform: "rotate(-15deg)" }}>
                    <span className="float-animation">💘</span>
                </div>
                <div style={{ position: "absolute", bottom: 8, right: 20, fontSize: 20, opacity: 0.4, zIndex: 1 }}>
                    <span className="sparkle" style={{ animationDelay: "0.3s" }}>💌</span>
                </div>
            </div>
        );
    }

    // Special design for New Year (Tết)
    if (occasion === "newyear") {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(180deg, #1e3a8a 0%, #312e81 30%, #7c2d12 60%, #991b1b 100%)",
                    position: "relative",
                    overflow: "auto",
                    borderRadius: 16,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                        }
                        @keyframes sparkle {
                            0%, 100% { opacity: 0.3; transform: scale(0.8); }
                            50% { opacity: 0.9; transform: scale(1.2); }
                        }
                        @keyframes lanternSway {
                            0%, 100% { transform: rotate(-5deg); }
                            50% { transform: rotate(5deg); }
                        }
                        @keyframes firework {
                            0% { opacity: 0; transform: scale(0); }
                            50% { opacity: 1; transform: scale(1.2); }
                            100% { opacity: 0; transform: scale(1.5); }
                        }
                        @keyframes titleSlideIn {
                            0% {
                                opacity: 0;
                                transform: translateY(-30px) scale(0.9);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }
                        @keyframes goldShine {
                            0% {
                                background-position: -200% center;
                            }
                            100% {
                                background-position: 200% center;
                            }
                        }
                        .float-animation {
                            animation: float 3s ease-in-out infinite;
                        }
                        .sparkle {
                            animation: sparkle 2s ease-in-out infinite;
                        }
                        .lantern-sway {
                            animation: lanternSway 3s ease-in-out infinite;
                        }
                        .firework {
                            animation: firework 2s ease-in-out infinite;
                        }
                        .title-animation {
                            animation: titleSlideIn 1s ease-out forwards;
                        }
                        .gold-shine {
                            position: relative;
                            display: inline-block;
                        }
                        .gold-shine::after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: -100%;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent);
                            animation: goldShine 3s ease-in-out 1s infinite;
                        }
                    `
                }} />

                {/* Background Fireworks */}
                <div style={{ position: "absolute", top: 20, left: 30, fontSize: 40, opacity: 0.3, zIndex: 1 }}>
                    <span className="firework" style={{ animationDelay: "0s" }}>✨</span>
                </div>
                <div style={{ position: "absolute", top: 40, right: 40, fontSize: 35, opacity: 0.25, zIndex: 1 }}>
                    <span className="firework" style={{ animationDelay: "0.5s" }}>🎆</span>
                </div>
                <div style={{ position: "absolute", top: 60, left: 50, fontSize: 30, opacity: 0.2, zIndex: 1 }}>
                    <span className="firework" style={{ animationDelay: "1s" }}>✨</span>
                </div>

                {/* Lanterns */}
                <div style={{ position: "absolute", top: 10, left: 10, fontSize: 32, zIndex: 5 }}>
                    <span className="lantern-sway" style={{ animationDelay: "0s" }}>🏮</span>
                </div>
                <div style={{ position: "absolute", top: 10, right: 10, fontSize: 32, zIndex: 5 }}>
                    <span className="lantern-sway" style={{ animationDelay: "0.3s" }}>🏮</span>
                </div>

                {/* Top Section - Title */}
                <div style={{ position: "relative", padding: "20px 20px 0px", textAlign: "center", zIndex: 10, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "30%" }}>
                    {/* Decorative elements */}
                    <div style={{ position: "absolute", top: 8, left: 16, fontSize: 18, opacity: 0.6 }}>
                        <span className="sparkle" style={{ animationDelay: "0s" }}>🧧</span>
                    </div>
                    <div style={{ position: "absolute", top: 6, right: 20, fontSize: 16, opacity: 0.5 }}>
                        <span className="sparkle" style={{ animationDelay: "0.5s" }}>🎊</span>
                    </div>

                    {/* Title */}
                    <div style={{ color: "#FFD700", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                        <div
                            className="title-animation gold-shine"
                            style={{
                                fontSize: "clamp(36px, 6vw, 64px)",
                                fontWeight: 400,
                                letterSpacing: "4px",
                                marginBottom: 0,
                                fontFamily: "'Great Vibes', cursive",
                                textTransform: "none",
                                color: "#FFD700",
                                textShadow: "3px 3px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.5)",
                                position: "relative",
                                textAlign: "center",
                                lineHeight: 1.2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <span>Cung Chúc</span>
                            <span>Tân Xuân</span>
                        </div>
                    </div>
                </div>

                {/* Personal Image Section - Between Title and Message Box */}
                {personalImageUrl && (
                    <div style={{
                        position: "relative",
                        padding: "4px 20px",
                        marginTop: "-28px",
                        marginBottom: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                        zIndex: 5,
                    }}>
                        <img
                            src={personalImageUrl}
                            alt="Personal"
                            style={{
                                width: "195px",
                                height: "285px",
                                objectFit: "cover",
                                borderRadius: "12px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            }}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    </div>
                )}

                {/* Bottom Section - Message Box */}
                <div style={{ flex: 1, position: "relative", padding: "0 20px 24px", minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                    {/* Message Box */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #fff8e1 0%, #fff5e6 100%)",
                            borderRadius: 16,
                            padding: "20px 18px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            border: "2px solid rgba(255, 215, 0, 0.4)",
                            overflow: "hidden",
                            maxWidth: "90%",
                            margin: "0 auto",
                            width: "100%",
                            minHeight: "220px",
                            maxHeight: "calc(100% - 24px)",
                        }}
                    >
                        {/* Ornate corner decorations */}
                        <div style={{ position: "absolute", top: 4, left: 4, width: 20, height: 20, borderTop: "3px solid #dc2626", borderLeft: "3px solid #dc2626", borderRadius: "4px 0 0 0" }} />
                        <div style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderTop: "3px solid #dc2626", borderRight: "3px solid #dc2626", borderRadius: "0 4px 0 0" }} />
                        <div style={{ position: "absolute", bottom: 4, left: 4, width: 20, height: 20, borderBottom: "3px solid #dc2626", borderLeft: "3px solid #dc2626", borderRadius: "0 0 0 4px" }} />
                        <div style={{ position: "absolute", bottom: 4, right: 4, width: 20, height: 20, borderBottom: "3px solid #dc2626", borderRight: "3px solid #dc2626", borderRadius: "0 0 4px 0" }} />

                        {/* Red Banner */}
                        <div
                            style={{
                                background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                                color: "#fff",
                                padding: "10px 14px",
                                borderRadius: "8px 8px 0 0",
                                margin: "-20px -18px 14px -18px",
                                textAlign: "center",
                                fontWeight: 700,
                                fontSize: "clamp(13px, 1.8vw, 18px)",
                                letterSpacing: "1.5px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                borderBottom: "2px solid #FFD700",
                            }}
                        >
                            CHÚC MỪNG NĂM MỚI
                        </div>

                        {/* Content */}
                        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 10, height: "100%", minHeight: 0 }}>
                            {/* Message - Scrollable area */}
                            <div
                                style={{
                                    flex: 1,
                                    fontSize: "clamp(11px, 1.4vw, 15px)",
                                    color: "#7f1d1d",
                                    lineHeight: 1.7,
                                    textAlign: "center",
                                    fontFamily: "'Be Vietnam Pro', sans-serif",
                                    padding: "10px 8px",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    minHeight: 0,
                                    maxHeight: "none",
                                }}
                            >
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                        div[style*="overflowY: auto"]::-webkit-scrollbar {
                                            width: 6px;
                                        }
                                        div[style*="overflowY: auto"]::-webkit-scrollbar-track {
                                            background: rgba(255, 215, 0, 0.2);
                                            border-radius: 3px;
                                        }
                                        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
                                            background: rgba(220, 38, 38, 0.4);
                                            border-radius: 3px;
                                        }
                                        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
                                            background: rgba(220, 38, 38, 0.6);
                                        }
                                    `
                                }} />
                                {displayMessage}
                            </div>

                            {/* Recipient và Sender */}
                            <div style={{ flexShrink: 0, paddingTop: 6, borderTop: "2px dashed rgba(220, 38, 38, 0.3)", marginTop: 4 }}>
                                {displayRecipient && (
                                    <div
                                        style={{
                                            fontSize: "clamp(8px, 1vw, 11px)",
                                            color: "#dc2626",
                                            fontWeight: 600,
                                            marginBottom: 2,
                                            textAlign: "left",
                                        }}
                                    >
                                        Gửi đến: <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.1em", fontStyle: "italic" }}>{displayRecipient}</span>
                                    </div>
                                )}
                                {displaySender && (
                                    <div
                                        style={{
                                            fontSize: "clamp(7px, 0.9vw, 10px)",
                                            color: "#991b1b",
                                            textAlign: "right",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        — {displaySender}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plum Blossoms (Hoa Mai) */}
                <div style={{ position: "absolute", bottom: 8, left: 12, fontSize: 24, opacity: 0.6, zIndex: 1 }}>
                    <span className="float-animation" style={{ animationDelay: "0s" }}>🌼</span>
                </div>
                <div style={{ position: "absolute", bottom: 6, right: 16, fontSize: 28, opacity: 0.5, zIndex: 1 }}>
                    <span className="float-animation" style={{ animationDelay: "0.3s" }}>🌼</span>
                </div>
            </div>
        );
    }

    // Special design for Women's Day
    if (occasion === "womensday") {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: theme.gradient,
                    position: "relative",
                    overflow: "auto",
                    borderRadius: 16,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                        }
                        @keyframes sparkle {
                            0%, 100% { opacity: 0.3; transform: scale(0.8); }
                            50% { opacity: 0.8; transform: scale(1.2); }
                        }
                        @keyframes happySlideIn {
                            0% {
                                opacity: 0;
                                transform: translateY(-30px) scale(0.8);
                            }
                            60% {
                                opacity: 1;
                                transform: translateY(0) scale(1.05);
                            }
                            100% {
                                transform: translateY(0) scale(1);
                            }
                        }
                        @keyframes happyShine {
                            0% {
                                background-position: -200% center;
                            }
                            100% {
                                background-position: 200% center;
                            }
                        }
                        @keyframes womenDayFadeIn {
                            0% {
                                opacity: 0;
                                transform: translateY(20px) scale(0.9);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }
                        .float-animation {
                            animation: float 3s ease-in-out infinite;
                        }
                        .sparkle {
                            animation: sparkle 2s ease-in-out infinite;
                        }
                        .happy-animation {
                            animation: happySlideIn 1s ease-out forwards;
                            color: #fff;
                        }
                        .happy-shine {
                            position: relative;
                            display: inline-block;
                        }
                        .happy-shine::after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: -100%;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                            animation: happyShine 2s ease-in-out 1s infinite;
                        }
                        .womensday-animation {
                            animation: womenDayFadeIn 1.2s ease-out 0.3s forwards;
                            opacity: 0;
                        }
                    `
                }} />

                {/* Top Section - Title */}
                <div style={{ position: "relative", padding: "20px 20px 0px", textAlign: "center", zIndex: 10, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "30%", marginTop: "-30px" }}>
                    {/* Decorative hearts */}
                    <div style={{ position: "absolute", top: 16, left: 20, fontSize: 18, opacity: 0.6 }}>
                        <span className="sparkle" style={{ animationDelay: "0s" }}>💖</span>
                    </div>
                    <div style={{ position: "absolute", top: 14, right: 24, fontSize: 16, opacity: 0.5 }}>
                        <span className="sparkle" style={{ animationDelay: "0.5s" }}>💕</span>
                    </div>

                    {/* Title */}
                    <div style={{ color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div
                            className="happy-animation happy-shine"
                            style={{
                                fontSize: "clamp(24px, 3.5vw, 36px)",
                                fontWeight: 300,
                                letterSpacing: "3px",
                                marginBottom: 4,
                                fontFamily: "'Great Vibes', cursive",
                                textTransform: "none",
                                color: "#fff",
                                textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
                                position: "relative",
                            }}
                        >
                            Happy
                        </div>
                        <div
                            className="womensday-animation"
                            style={{
                                fontSize: "clamp(40px, 6vw, 72px)",
                                fontWeight: 400,
                                letterSpacing: "2px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                fontFamily: "'Great Vibes', cursive",
                                lineHeight: 1.1,
                                color: "#fff",
                                textShadow: "3px 3px 8px rgba(0,0,0,0.4)",
                            }}
                        >
                            <span>Women's</span>
                            <span style={{ fontSize: "0.95em" }}>Day</span>
                            <span style={{ fontSize: "0.6em", marginLeft: 6, opacity: 0.9 }}>💐</span>
                        </div>
                    </div>
                </div>

                {/* Personal Image Section - Between Title and Message Box */}
                {personalImageUrl && (
                    <div style={{
                        position: "relative",
                        padding: "4px 20px",
                        marginTop: "-40px",
                        marginBottom: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                        zIndex: 5,
                    }}>
                        <img
                            src={personalImageUrl}
                            alt="Personal"
                            style={{
                                width: "200px",
                                height: "280px",
                                objectFit: "cover",
                                borderRadius: "12px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            }}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    </div>
                )}

                {/* Bottom Section - Message Box */}
                <div style={{ flex: 1, position: "relative", padding: "0 20px 20px", minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                    {/* Message Box với grid pattern */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #ffe5e5 0%, #fff5f5 100%)",
                            borderRadius: 16,
                            padding: "18px 16px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            border: "2px solid rgba(255, 255, 255, 0.6)",
                            overflow: "hidden",
                            maxWidth: "92%",
                            margin: "0 auto",
                            width: "100%",
                            minHeight: "200px",
                            maxHeight: "calc(100% - 20px)",
                        }}
                    >
                        {/* Grid pattern background */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundImage: `
                                    linear-gradient(rgba(255, 182, 193, 0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255, 182, 193, 0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: "20px 20px",
                                borderRadius: 20,
                                pointerEvents: "none",
                            }}
                        />

                        {/* Ribbon bow ở góc trên trái */}
                        <div style={{ position: "absolute", top: -10, left: 16, zIndex: 5 }}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    background: "linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)",
                                    borderRadius: "50% 50% 50% 0",
                                    transform: "rotate(-45deg)",
                                    boxShadow: "0 4px 12px rgba(255, 105, 180, 0.4)",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 6,
                                    left: 6,
                                    width: 20,
                                    height: 20,
                                    background: "linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)",
                                    borderRadius: "50%",
                                    boxShadow: "0 2px 8px rgba(255, 105, 180, 0.3)",
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 8, height: "100%", minHeight: 0 }}>
                            {/* Title trong message box */}
                            <div style={{ textAlign: "center", flexShrink: 0, marginBottom: 4 }}>
                                <div
                                    style={{
                                        fontSize: "clamp(12px, 1.6vw, 16px)",
                                        fontWeight: 700,
                                        color: "#dc2626",
                                        letterSpacing: "0.5px",
                                        marginBottom: 3,
                                    }}
                                >
                                    MỪNG NGÀY QUỐC TẾ PHỤ NỮ
                                </div>
                                <div
                                    style={{
                                        fontSize: "clamp(14px, 2vw, 20px)",
                                        fontWeight: 700,
                                        color: "#dc2626",
                                        letterSpacing: "1.5px",
                                    }}
                                >
                                    08.03
                                </div>
                            </div>

                            {/* Message - Scrollable area */}
                            <div
                                style={{
                                    flex: 1,
                                    fontSize: "clamp(10px, 1.3vw, 14px)",
                                    color: "#7f1d1d",
                                    lineHeight: 1.6,
                                    textAlign: "center",
                                    fontFamily: "'Be Vietnam Pro', sans-serif",
                                    padding: "8px 6px",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    minHeight: 0,
                                    maxHeight: "none",
                                }}
                            >
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                        div[style*="overflowY: auto"]::-webkit-scrollbar {
                                            width: 6px;
                                        }
                                        div[style*="overflowY: auto"]::-webkit-scrollbar-track {
                                            background: rgba(255, 182, 193, 0.2);
                                            border-radius: 3px;
                                        }
                                        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
                                            background: rgba(220, 38, 38, 0.4);
                                            border-radius: 3px;
                                        }
                                        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
                                            background: rgba(220, 38, 38, 0.6);
                                        }
                                    `
                                }} />
                                {displayMessage}
                            </div>

                            {/* Recipient và Sender */}
                            <div style={{ flexShrink: 0, paddingTop: 6, borderTop: "2px dashed rgba(220, 38, 38, 0.3)", marginTop: 4 }}>
                                {displayRecipient && (
                                    <div
                                        style={{
                                            fontSize: "clamp(8px, 1vw, 11px)",
                                            color: "#dc2626",
                                            fontWeight: 600,
                                            marginBottom: 2,
                                            textAlign: "left",
                                        }}
                                    >
                                        Gửi đến: <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.1em", fontStyle: "italic" }}>{displayRecipient}</span>
                                    </div>
                                )}
                                {displaySender && (
                                    <div
                                        style={{
                                            fontSize: "clamp(7px, 0.9vw, 10px)",
                                            color: "#991b1b",
                                            textAlign: "right",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        — {displaySender}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Decorative elements - beauty products */}
                        <div style={{ position: "absolute", bottom: -8, right: -8, fontSize: 24, opacity: 0.3, transform: "rotate(-15deg)" }}>
                            💄
                        </div>
                        <div style={{ position: "absolute", top: -6, right: 16, fontSize: 16, opacity: 0.25 }}>
                            🌸
                        </div>
                    </div>
                </div>

                {/* Decorative flowers ở background */}
                <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: 16, opacity: 0.4 }}>
                    <span className="sparkle" style={{ animationDelay: "1s" }}>🌺</span>
                </div>
                <div style={{ position: "absolute", top: 50, right: 20, fontSize: 14, opacity: 0.3 }}>
                    <span className="sparkle" style={{ animationDelay: "1.5s" }}>🌷</span>
                </div>
            </div>
        );
    }

    // Default design for other occasions
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: theme.gradient,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                borderRadius: 16,
            }}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes sparkle {
                        0%, 100% { opacity: 0; transform: scale(0); }
                        50% { opacity: 1; transform: scale(1); }
                    }
                    .float-animation {
                        animation: float 3s ease-in-out infinite;
                    }
                    .sparkle {
                        animation: sparkle 2s ease-in-out infinite;
                    }
                `
            }} />

            {/* Decorations */}
            {theme.decorations.map((decoration, i) => (
                <span
                    key={i}
                    className="sparkle"
                    style={{
                        position: "absolute",
                        fontSize: 24,
                        opacity: 0.6,
                        top: `${10 + (i * 20)}%`,
                        left: `${5 + (i * 20)}%`,
                        animationDelay: `${i * 0.3}s`,
                    }}
                >
                    {decoration}
                </span>
            ))}

            {/* Main Content */}
            <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "100%" }}>
                <div className="float-animation" style={{ fontSize: 48, marginBottom: 8 }}>
                    {theme.icon}
                </div>
                <h3 style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 700, letterSpacing: "2px", marginBottom: 12, textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                    {theme.title}
                </h3>

                <div
                    style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 16,
                        maxWidth: 400,
                        margin: "0 auto 16px",
                    }}
                >
                    <p style={{ fontSize: 14, marginBottom: 8 }}>
                        Gửi đến: <span style={{ fontWeight: 700, fontFamily: "'Dancing Script', cursive", fontSize: 20 }}>
                            {displayRecipient}
                        </span>
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.6, fontStyle: "italic" }}>
                        "{displayMessage}"
                    </p>
                </div>

                <p style={{ fontSize: 14, opacity: 0.9 }}>
                    Từ: <span style={{ fontWeight: 600, fontFamily: "'Dancing Script', cursive", fontSize: 18 }}>
                        {displaySender}
                    </span>
                </p>
            </div>

            {/* Bottom decoration */}
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8, opacity: 0.5 }}>
                {theme.decorations.slice(0, 3).map((d, i) => (
                    <span key={i} style={{ fontSize: 20 }}>{d}</span>
                ))}
            </div>
        </div>
    );
}
