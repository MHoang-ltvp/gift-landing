"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardPreview from "@/app/components/CardPreview";
import type { Card, CardOccasion } from "@/types";
import { theme } from "@/lib/theme";

// Giới hạn độ dài nội dung thiệp (ký tự)
const MAX_MESSAGE_LENGTH = 1000;

const defaultMessages: Record<CardOccasion, string[]> = {
    newyear: [
        "Chúc mừng năm mới! Chúc bạn một năm mới tràn đầy niềm vui, sức khỏe và thành công. Mọi điều tốt đẹp nhất sẽ đến với bạn! 🎆🧧",
        "Năm mới phát tài phát lộc! Chúc gia đình bạn luôn hạnh phúc, ấm no và thịnh vượng. Vạn sự như ý! 🧧✨",
        "Happy New Year! Chúc bạn một năm mới tràn đầy may mắn, gặp nhiều thuận lợi trong công việc và cuộc sống! 🎊🎉",
    ],
    valentine: [
        "Happy Valentine! Gửi đến người đặc biệt những lời yêu thương chân thành nhất. Cảm ơn vì đã luôn ở bên cạnh! 💕💖",
        "Anh/Em yêu em/anh! Trong ngày Valentine này, anh/em muốn nói rằng em/anh là điều tuyệt vời nhất trong cuộc đời anh/em! 💝💗",
        "Happy Valentine's Day! Cảm ơn vì đã làm cho cuộc sống của anh/em thêm ý nghĩa. Yêu em/anh mãi mãi! ❤️💘",
    ],
    womensday: [
        "Chúc mừng ngày Quốc tế Phụ nữ 8/3! Chúc bạn luôn xinh đẹp, hạnh phúc và tỏa sáng như những bông hoa mùa xuân! 🌸🌷",
        "Happy Women's Day! Chúc các chị em phụ nữ luôn mạnh mẽ, tự tin và thành công trong mọi lĩnh vực! 🌺💐",
        "Chúc mừng 8/3! Gửi đến bạn những lời chúc tốt đẹp nhất. Chúc bạn luôn vui vẻ, hạnh phúc và tràn đầy năng lượng! 🌹✨",
    ],
};

export default function AdminCards() {
    const router = useRouter();
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [occasion, setOccasion] = useState<CardOccasion>("newyear");
    const [recipient, setRecipient] = useState("");
    const [sender, setSender] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"custom" | "default">("custom");
    const [selectedDefaultMessage, setSelectedDefaultMessage] = useState("");

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            const res = await fetch("/api/admin/cards");
            if (res.ok) {
                const data = await res.json();
                setCards(data.cards || []);
            }
        } catch (error) {
            console.error("Error loading cards:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Sử dụng displayMessage để check cả custom và default message
        const finalMessage = messageType === "custom" ? message : selectedDefaultMessage;
        
        if (!recipient || !sender || !finalMessage) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        // Validate độ dài message
        if (finalMessage.length > MAX_MESSAGE_LENGTH) {
            alert(`Nội dung lời chúc quá dài! Vui lòng rút ngắn xuống còn tối đa ${MAX_MESSAGE_LENGTH} ký tự.\n\nHiện tại: ${finalMessage.length} ký tự`);
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/cards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    occasion,
                    payload: {
                        toName: recipient,
                        fromName: sender,
                        message: finalMessage,
                    },
                }),
            });

            const data = await res.json();
            if (res.ok && data.ok) {
                alert("Đã tạo thiệp thành công! 🎉");
                // Reset form
                setRecipient("");
                setSender("");
                setMessage("");
                setSelectedDefaultMessage("");
                loadCards();
            } else {
                alert("Không thể tạo thiệp: " + (data.error || "Lỗi không xác định"));
            }
        } catch (error) {
            console.error("Error creating card:", error);
            alert("Có lỗi xảy ra khi tạo thiệp!");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (cardId: string) => {
        if (!confirm("Bạn có chắc muốn xóa thiệp này?")) return;

        try {
            const res = await fetch(`/api/admin/cards/${cardId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Đã xóa thiệp!");
                loadCards();
            } else {
                alert("Không thể xóa thiệp!");
            }
        } catch (error) {
            console.error("Error deleting card:", error);
            alert("Có lỗi xảy ra khi xóa thiệp!");
        }
    };

    const displayMessage = messageType === "custom" ? message : selectedDefaultMessage;

    return (
        <main style={{ padding: 24, fontFamily: theme.typography.fontFamily.body, backgroundColor: theme.colors.bgPrimary, minHeight: "100vh" }}>
            <div style={{ maxWidth: 1400, margin: "0 auto" }}>
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
                        ✨ Tạo Thiệp Chúc Mừng ✨
                    </h1>
                </div>

                {/* Create Card Section */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
                        gap: theme.spacing.xl,
                        marginBottom: theme.spacing.xxxl,
                    }}
                >
                    {/* Form Section */}
                    <div
                        style={{
                            backgroundColor: theme.colors.bgWhite,
                            borderRadius: theme.borderRadius.xl,
                            boxShadow: theme.shadows.lg,
                            padding: theme.spacing.xl,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: theme.typography.fontSize.xl,
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.textPrimary,
                                marginBottom: theme.spacing.lg,
                                display: "flex",
                                alignItems: "center",
                                gap: theme.spacing.sm,
                            }}
                        >
                            <span
                                style={{
                                    width: 32,
                                    height: 32,
                                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: theme.colors.textWhite,
                                    fontSize: theme.typography.fontSize.sm,
                                    fontWeight: theme.typography.fontWeight.bold,
                                }}
                            >
                                1
                            </span>
                            Nhập Thông Tin Thiệp
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: theme.spacing.lg }}>
                            {/* Occasion Selection */}
                            <div>
                                <label style={{ display: "block", fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.textPrimary, marginBottom: theme.spacing.md }}>
                                    Chọn Dịp 🎉
                                </label>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: theme.spacing.md }}>
                                    {[
                                        { value: "newyear" as CardOccasion, icon: "🎆", label: "Năm Mới", color: theme.colors.primary },
                                        { value: "valentine" as CardOccasion, icon: "💕", label: "Valentine", color: "#f472b6" },
                                        { value: "womensday" as CardOccasion, icon: "🌸", label: "8/3", color: "#a855f7" },
                                    ].map((occ) => (
                                        <button
                                            key={occ.value}
                                            type="button"
                                            onClick={() => {
                                                setOccasion(occ.value);
                                                setSelectedDefaultMessage("");
                                            }}
                                            style={{
                                                padding: theme.spacing.md,
                                                borderRadius: theme.borderRadius.xl,
                                                border: `2px solid ${occasion === occ.value ? occ.color : theme.colors.borderMedium}`,
                                                backgroundColor: occasion === occ.value ? `${occ.color}15` : theme.colors.bgGray,
                                                cursor: "pointer",
                                                transition: theme.transitions.normal,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: theme.spacing.xs,
                                                boxShadow: occasion === occ.value ? theme.shadows.md : "none",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (occasion !== occ.value) {
                                                    e.currentTarget.style.backgroundColor = theme.colors.bgSecondary;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (occasion !== occ.value) {
                                                    e.currentTarget.style.backgroundColor = theme.colors.bgGray;
                                                }
                                            }}
                                        >
                                            <div style={{ fontSize: 32 }}>{occ.icon}</div>
                                            <div style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.semibold, color: occ.color }}>
                                                {occ.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recipient Name */}
                            <div>
                                <label htmlFor="recipient" style={{ display: "block", fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                    Gửi Đến 💌
                                </label>
                                <input
                                    id="recipient"
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder="Tên người nhận..."
                                    style={{
                                        width: "100%",
                                        padding: theme.spacing.md,
                                        borderRadius: theme.borderRadius.xl,
                                        border: `2px solid ${theme.colors.borderMedium}`,
                                        fontSize: theme.typography.fontSize.md,
                                        outline: "none",
                                        transition: theme.transitions.normal,
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

                            {/* Sender Name */}
                            <div>
                                <label htmlFor="sender" style={{ display: "block", fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                    Người Gửi ✍️
                                </label>
                                <input
                                    id="sender"
                                    type="text"
                                    value={sender}
                                    onChange={(e) => setSender(e.target.value)}
                                    placeholder="Tên của bạn..."
                                    style={{
                                        width: "100%",
                                        padding: theme.spacing.md,
                                        borderRadius: theme.borderRadius.xl,
                                        border: `2px solid ${theme.colors.borderMedium}`,
                                        fontSize: theme.typography.fontSize.md,
                                        outline: "none",
                                        transition: theme.transitions.normal,
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

                            {/* Message Type Selection */}
                            <div>
                                <label style={{ display: "block", fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.textPrimary, marginBottom: theme.spacing.md }}>
                                    Loại Lời Chúc 💬
                                </label>
                                <div style={{ display: "flex", gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMessageType("custom");
                                            setSelectedDefaultMessage("");
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                            borderRadius: theme.borderRadius.xl,
                                            border: `2px solid ${messageType === "custom" ? theme.colors.primary : theme.colors.borderMedium}`,
                                            backgroundColor: messageType === "custom" ? theme.colors.primary : theme.colors.bgWhite,
                                            color: messageType === "custom" ? theme.colors.textWhite : theme.colors.textSecondary,
                                            fontWeight: theme.typography.fontWeight.semibold,
                                            cursor: "pointer",
                                            transition: theme.transitions.normal,
                                        }}
                                    >
                                        ✍️ Tự viết
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMessageType("default");
                                            setSelectedDefaultMessage("");
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                            borderRadius: theme.borderRadius.xl,
                                            border: `2px solid ${messageType === "default" ? theme.colors.primary : theme.colors.borderMedium}`,
                                            backgroundColor: messageType === "default" ? theme.colors.primary : theme.colors.bgWhite,
                                            color: messageType === "default" ? theme.colors.textWhite : theme.colors.textSecondary,
                                            fontWeight: theme.typography.fontWeight.semibold,
                                            cursor: "pointer",
                                            transition: theme.transitions.normal,
                                        }}
                                    >
                                        📝 Lời chúc mẫu
                                    </button>
                                </div>
                            </div>

                            {/* Custom Message Input */}
                            {messageType === "custom" && (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing.sm }}>
                                        <label htmlFor="message" style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.textPrimary }}>
                                            Nội Dung Lời Chúc
                                        </label>
                                        <span
                                            style={{
                                                fontSize: theme.typography.fontSize.xs,
                                                color: message.length > MAX_MESSAGE_LENGTH ? theme.colors.error : message.length > MAX_MESSAGE_LENGTH * 0.8 ? theme.colors.warning : theme.colors.textTertiary,
                                                fontWeight: theme.typography.fontWeight.medium,
                                            }}
                                        >
                                            {message.length} / {MAX_MESSAGE_LENGTH}
                                        </span>
                                    </div>
                                    <textarea
                                        id="message"
                                        rows={8}
                                        value={message}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (newValue.length <= MAX_MESSAGE_LENGTH) {
                                                setMessage(newValue);
                                            }
                                        }}
                                        placeholder="Viết lời chúc của bạn..."
                                        maxLength={MAX_MESSAGE_LENGTH}
                                        style={{
                                            width: "100%",
                                            padding: theme.spacing.md,
                                            borderRadius: theme.borderRadius.xl,
                                            border: `2px solid ${message.length > MAX_MESSAGE_LENGTH ? theme.colors.error : theme.colors.borderMedium}`,
                                            fontSize: theme.typography.fontSize.md,
                                            outline: "none",
                                            resize: "vertical",
                                            fontFamily: "inherit",
                                            transition: theme.transitions.normal,
                                            minHeight: "120px",
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = message.length > MAX_MESSAGE_LENGTH ? theme.colors.error : theme.colors.primary;
                                            e.currentTarget.style.boxShadow = theme.shadows.sm;
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = message.length > MAX_MESSAGE_LENGTH ? theme.colors.error : theme.colors.borderMedium;
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    />
                                    {message.length > MAX_MESSAGE_LENGTH && (
                                        <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.error, marginTop: theme.spacing.xs, marginBottom: 0 }}>
                                            ⚠️ Nội dung quá dài! Vui lòng rút ngắn xuống còn tối đa {MAX_MESSAGE_LENGTH} ký tự.
                                        </p>
                                    )}
                                    {message.length > MAX_MESSAGE_LENGTH * 0.8 && message.length <= MAX_MESSAGE_LENGTH && (
                                        <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.warning, marginTop: theme.spacing.xs, marginBottom: 0 }}>
                                            💡 Bạn còn {MAX_MESSAGE_LENGTH - message.length} ký tự.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Default Message Selection */}
                            {messageType === "default" && (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing.sm }}>
                                        <label htmlFor="default-message-select" style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.textPrimary }}>
                                            Chọn Lời Chúc Mẫu
                                        </label>
                                        {selectedDefaultMessage && (
                                            <span
                                                style={{
                                                    fontSize: theme.typography.fontSize.xs,
                                                    color: selectedDefaultMessage.length > MAX_MESSAGE_LENGTH ? theme.colors.error : selectedDefaultMessage.length > MAX_MESSAGE_LENGTH * 0.8 ? theme.colors.warning : theme.colors.textTertiary,
                                                    fontWeight: theme.typography.fontWeight.medium,
                                                }}
                                            >
                                                {selectedDefaultMessage.length} / {MAX_MESSAGE_LENGTH}
                                            </span>
                                        )}
                                    </div>
                                    <select
                                        id="default-message-select"
                                        value={selectedDefaultMessage}
                                        onChange={(e) => {
                                            const selectedMsg = e.target.value;
                                            if (selectedMsg.length <= MAX_MESSAGE_LENGTH) {
                                                setSelectedDefaultMessage(selectedMsg);
                                            } else {
                                                alert(`Lời chúc mẫu này quá dài (${selectedMsg.length} ký tự). Vui lòng chọn lời chúc khác hoặc chỉnh sửa sau khi chọn.`);
                                            }
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: theme.spacing.md,
                                            borderRadius: theme.borderRadius.xl,
                                            border: `2px solid ${selectedDefaultMessage.length > MAX_MESSAGE_LENGTH ? theme.colors.error : theme.colors.borderMedium}`,
                                            fontSize: theme.typography.fontSize.md,
                                            outline: "none",
                                            backgroundColor: theme.colors.bgWhite,
                                            transition: theme.transitions.normal,
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = selectedDefaultMessage.length > MAX_MESSAGE_LENGTH ? theme.colors.error : theme.colors.primary;
                                            e.currentTarget.style.boxShadow = theme.shadows.sm;
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = selectedDefaultMessage.length > MAX_MESSAGE_LENGTH ? theme.colors.error : theme.colors.borderMedium;
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <option value="">-- Chọn lời chúc --</option>
                                        {defaultMessages[occasion]
                                            .filter((msg) => msg.length <= MAX_MESSAGE_LENGTH)
                                            .map((msg, index) => (
                                                <option key={index} value={msg}>
                                                    {msg.length > 50 ? msg.substring(0, 50) + "..." : msg}
                                                </option>
                                            ))}
                                    </select>
                                    {selectedDefaultMessage && selectedDefaultMessage.length > MAX_MESSAGE_LENGTH && (
                                        <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.error, marginTop: theme.spacing.xs, marginBottom: 0 }}>
                                            ⚠️ Lời chúc mẫu này quá dài! Vui lòng chọn lời chúc khác hoặc chuyển sang "Tự viết" để chỉnh sửa.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: "flex", gap: theme.spacing.md, paddingTop: theme.spacing.sm }}>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        flex: 1,
                                        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                                        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                                        color: theme.colors.textWhite,
                                        fontWeight: theme.typography.fontWeight.semibold,
                                        borderRadius: theme.borderRadius.xl,
                                        border: "none",
                                        cursor: saving ? "not-allowed" : "pointer",
                                        boxShadow: theme.shadows.lg,
                                        transition: theme.transitions.normal,
                                        opacity: saving ? 0.7 : 1,
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
                                    {saving ? "Đang lưu..." : "💾 Lưu Thiệp"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRecipient("");
                                        setSender("");
                                        setMessage("");
                                        setSelectedDefaultMessage("");
                                        setMessageType("custom");
                                    }}
                                    style={{
                                        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                                        backgroundColor: theme.colors.bgGray,
                                        color: theme.colors.textSecondary,
                                        fontWeight: theme.typography.fontWeight.semibold,
                                        borderRadius: theme.borderRadius.xl,
                                        border: "none",
                                        cursor: "pointer",
                                        transition: theme.transitions.normal,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.colors.borderMedium;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.colors.bgGray;
                                    }}
                                >
                                    🔄
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div
                        style={{
                            backgroundColor: theme.colors.bgWhite,
                            borderRadius: theme.borderRadius.xl,
                            boxShadow: theme.shadows.lg,
                            padding: theme.spacing.xl,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: theme.typography.fontSize.xl,
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.textPrimary,
                                marginBottom: theme.spacing.lg,
                                display: "flex",
                                alignItems: "center",
                                gap: theme.spacing.sm,
                            }}
                        >
                            <span
                                style={{
                                    width: 32,
                                    height: 32,
                                    background: `linear-gradient(135deg, #a855f7 0%, #f472b6 100%)`,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: theme.colors.textWhite,
                                    fontSize: theme.typography.fontSize.sm,
                                    fontWeight: theme.typography.fontWeight.bold,
                                }}
                            >
                                2
                            </span>
                            Xem Trước Thiệp
                        </h2>
                        <div style={{ aspectRatio: "3/4", borderRadius: theme.borderRadius.xl, overflow: "hidden", boxShadow: theme.shadows.xl, maxHeight: "80vh" }}>
                            <CardPreview
                                occasion={occasion}
                                recipient={recipient}
                                sender={sender}
                                message={displayMessage}
                            />
                        </div>
                    </div>
                </div>

                {/* Saved Cards List */}
                <div style={{ marginTop: theme.spacing.xxxl }}>
                    <h2 style={{ fontSize: theme.typography.fontSize["2xl"], fontWeight: theme.typography.fontWeight.bold, color: theme.colors.textPrimary, marginBottom: theme.spacing.lg }}>
                        Danh sách thiệp ({cards.length})
                    </h2>
                    {loading ? (
                        <p style={{ color: theme.colors.textSecondary }}>Đang tải...</p>
                    ) : cards.length === 0 ? (
                        <div style={{ textAlign: "center", padding: theme.spacing.xxxl, color: theme.colors.textTertiary }}>
                            <div style={{ fontSize: 48, marginBottom: theme.spacing.md }}>📭</div>
                            <h3 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
                                Chưa có thiệp nào
                            </h3>
                            <p style={{ color: theme.colors.textTertiary }}>Hãy tạo thiệp đầu tiên của bạn!</p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: theme.spacing.lg }}>
                            {cards.map((card: any) => (
                                <div
                                    key={card._id}
                                    style={{
                                        backgroundColor: theme.colors.bgWhite,
                                        borderRadius: theme.borderRadius.xl,
                                        boxShadow: theme.shadows.md,
                                        overflow: "hidden",
                                        transition: theme.transitions.normal,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = theme.shadows.xl;
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = theme.shadows.md;
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    <div style={{ aspectRatio: "3/4" }}>
                                        <CardPreview
                                            occasion={(card.occasion || "newyear") as CardOccasion}
                                            recipient={card.payload?.toName || ""}
                                            sender={card.payload?.fromName || ""}
                                            message={card.payload?.message || ""}
                                        />
                                    </div>
                                    <div style={{ padding: theme.spacing.md, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <p style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.textPrimary, marginBottom: theme.spacing.xs }}>
                                                Code: {card.code}
                                            </p>
                                            <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textTertiary }}>
                                                {new Date(card.createdAt).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", gap: theme.spacing.sm }}>
                                            <a
                                                href={`/c/${card.code}`}
                                                target="_blank"
                                                style={{
                                                    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                                    backgroundColor: theme.colors.primary,
                                                    color: theme.colors.textWhite,
                                                    textDecoration: "none",
                                                    borderRadius: theme.borderRadius.md,
                                                    fontSize: theme.typography.fontSize.xs,
                                                    fontWeight: theme.typography.fontWeight.medium,
                                                }}
                                            >
                                                Mở
                                            </a>
                                            <a
                                                href={`/api/admin/cards/${card._id}/qr`}
                                                target="_blank"
                                                style={{
                                                    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                                    backgroundColor: theme.colors.success,
                                                    color: theme.colors.textWhite,
                                                    textDecoration: "none",
                                                    borderRadius: theme.borderRadius.md,
                                                    fontSize: theme.typography.fontSize.xs,
                                                    fontWeight: theme.typography.fontWeight.medium,
                                                }}
                                            >
                                                QR
                                            </a>
                                            <button
                                                onClick={() => handleDelete(card._id)}
                                                style={{
                                                    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                                    backgroundColor: theme.colors.error,
                                                    color: theme.colors.textWhite,
                                                    border: "none",
                                                    borderRadius: theme.borderRadius.md,
                                                    fontSize: theme.typography.fontSize.xs,
                                                    fontWeight: theme.typography.fontWeight.medium,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
