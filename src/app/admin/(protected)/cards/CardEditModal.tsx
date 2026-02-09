"use client";

import { useState, useEffect } from "react";
import CardPreview from "@/app/components/CardPreview";
import type { Card, CardOccasion } from "@/types";
import { theme } from "@/lib/theme";

const PRIMARY_COLOR = "#7C3AED";
const TEXT_PRIMARY = "#1F2937";
const TEXT_SECONDARY = "#6B7280";
const TEXT_TERTIARY = "#9CA3AF";
const BORDER_COLOR = "#E5E7EB";
const MAX_MESSAGE_LENGTH = 1000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB ảnh
const MAX_MUSIC_BYTES = 15 * 1024 * 1024; // 15MB nhạc

async function parseJsonResponse(res: Response): Promise<{ error?: string; url?: string; ok?: boolean }> {
    const text = await res.text();
    try {
        return JSON.parse(text) as { error?: string; url?: string; ok?: boolean };
    } catch {
        if (res.status === 413) return { error: "File quá lớn (giới hạn server, ví dụ Vercel ~4.5MB). Dùng file nhỏ hơn hoặc chọn Nhập URL." };
        return { error: "Lỗi không xác định" };
    }
}

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

interface CardEditModalProps {
    card: Card;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CardEditModal({ card, onClose, onSuccess }: CardEditModalProps) {
    const [occasion, setOccasion] = useState<CardOccasion>(card.occasion || "newyear");
    const [recipient, setRecipient] = useState(card.payload?.toName || "");
    const [sender, setSender] = useState(card.payload?.fromName || "");
    const [message, setMessage] = useState(card.payload?.message || "");
    const [messageType, setMessageType] = useState<"custom" | "default">("custom");
    const [selectedDefaultMessage, setSelectedDefaultMessage] = useState("");
    const [personalImage, setPersonalImage] = useState<File | null>(null);
    const [personalImagePreview, setPersonalImagePreview] = useState<string | null>(card.personalImageUrl || null);
    const [personalImageSource, setPersonalImageSource] = useState<"file" | "url">(card.personalImageUrl ? "url" : "file");
    const [personalImageUrl, setPersonalImageUrl] = useState(card.personalImageUrl || "");
    const [personalImageRemoved, setPersonalImageRemoved] = useState(false);
    const [qrImageUrl, setQrImageUrl] = useState(card.qrImageUrl || "");
    const [qrImageSource, setQrImageUrlSource] = useState<"file" | "url">("url");
    const [qrPreview, setQrPreview] = useState<string | null>(card.qrImageUrl || null);
    const [qrImageRemoved, setQrImageRemoved] = useState(false);
    const [musicSource, setMusicSource] = useState<"none" | "file" | "url">(card.musicUrl ? "url" : "none");
    const [musicFile, setMusicFile] = useState<File | null>(null);
    const [musicCustomUrl, setMusicCustomUrl] = useState(card.musicUrl || "");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (card.payload?.message && !defaultMessages[occasion].includes(card.payload.message)) {
            setMessageType("custom");
        }
    }, [card, occasion]);

    const displayMessage = messageType === "custom" ? message : selectedDefaultMessage;

    const handleQrImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Vui lòng chọn file ảnh");
                return;
            }
            if (file.size > MAX_IMAGE_BYTES) {
                alert("Ảnh tối đa 10MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalMessage = messageType === "custom" ? message : selectedDefaultMessage;

        if (!recipient || !sender || !finalMessage) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (finalMessage.length > MAX_MESSAGE_LENGTH) {
            alert(`Nội dung lời chúc quá dài! Vui lòng rút ngắn xuống còn tối đa ${MAX_MESSAGE_LENGTH} ký tự.\n\nHiện tại: ${finalMessage.length} ký tự`);
            return;
        }

        setSaving(true);
        try {
            let finalPersonalImageUrl: string | null | undefined = undefined; // undefined = không thay đổi
            let finalQrImageUrl: string | null | undefined = undefined; // undefined = không thay đổi

            // Upload personal image if file is selected
            if (personalImageSource === "file" && personalImage) {
                if (personalImage.size > MAX_IMAGE_BYTES) {
                    alert("Ảnh tối đa 10MB. Hãy chọn file nhỏ hơn hoặc dùng Nhập URL.");
                    setSaving(false);
                    return;
                }
                setUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append("file", personalImage);

                const uploadRes = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: uploadFormData,
                    credentials: "include",
                });

                const uploadData = await parseJsonResponse(uploadRes);

                if (!uploadRes.ok) {
                    setUploading(false);
                    alert(uploadData.error || "Upload ảnh cá nhân thất bại");
                    setSaving(false);
                    return;
                }

                finalPersonalImageUrl = uploadData.url ?? null;
                setUploading(false);
            } else if (personalImageSource === "url") {
                // Validate URL if provided
                if (personalImageUrl) {
                    if (!personalImageUrl.startsWith("http://") && !personalImageUrl.startsWith("https://")) {
                        alert("URL ảnh phải bắt đầu bằng http:// hoặc https://");
                        setSaving(false);
                        return;
                    }
                    finalPersonalImageUrl = personalImageUrl.trim();
                } else if (personalImageRemoved) {
                    // Nếu đã xóa preview, thì set null để xóa
                    finalPersonalImageUrl = null;
                } else if (personalImageUrl !== card.personalImageUrl) {
                    // Nếu URL thay đổi (từ có thành không có), set null
                    finalPersonalImageUrl = null;
                }
            } else if (personalImageRemoved) {
                // Nếu đã xóa preview, thì set null để xóa
                finalPersonalImageUrl = null;
            }
            // Nếu không có thay đổi, finalPersonalImageUrl vẫn là undefined

            // Upload QR image if file is selected
            if (qrImageSource === "file") {
                const fileInput = document.querySelector('input[name="qrImage"]') as HTMLInputElement;
                const file = fileInput?.files?.[0];
                if (file) {
                    if (file.size > MAX_IMAGE_BYTES) {
                        alert("Ảnh QR tối đa 10MB. Hãy chọn file nhỏ hơn.");
                        setSaving(false);
                        return;
                    }
                    setUploading(true);
                    const uploadFormData = new FormData();
                    uploadFormData.append("file", file);

                    const uploadRes = await fetch("/api/admin/upload", {
                        method: "POST",
                        body: uploadFormData,
                        credentials: "include",
                    });

                    const uploadData = await parseJsonResponse(uploadRes);

                    if (!uploadRes.ok) {
                        setUploading(false);
                        alert(uploadData.error || "Upload ảnh QR thất bại");
                        setSaving(false);
                        return;
                    }

                    finalQrImageUrl = uploadData.url ?? null;
                    setUploading(false);
                }
            } else if (qrImageSource === "url") {
                // Nếu đang dùng URL và có thay đổi
                if (qrImageUrl !== card.qrImageUrl) {
                    finalQrImageUrl = qrImageUrl || null;
                }
            }

            if (qrImageRemoved) {
                // Nếu đã xóa preview, thì set null để xóa
                finalQrImageUrl = null;
            }

            const updateData: any = {
                occasion,
                payload: {
                    toName: recipient,
                    fromName: sender,
                    message: finalMessage,
                },
            };

            // Chỉ gửi personalImageUrl nếu có thay đổi (không phải undefined)
            if (finalPersonalImageUrl !== undefined) {
                updateData.personalImageUrl = finalPersonalImageUrl;
            }

            // Chỉ gửi qrImageUrl nếu có thay đổi (không phải undefined)
            if (finalQrImageUrl !== undefined) {
                updateData.qrImageUrl = finalQrImageUrl;
            }

            let finalMusicUrl: string | null = null;
            if (musicSource === "file" && musicFile) {
                if (musicFile.size > MAX_MUSIC_BYTES) {
                    alert("File nhạc tối đa 15MB. Hãy chọn file nhỏ hơn hoặc dùng Nhập URL.");
                    setSaving(false);
                    return;
                }
                setUploading(true);
                const musicFormData = new FormData();
                musicFormData.append("file", musicFile);
                const musicRes = await fetch("/api/admin/upload", { method: "POST", body: musicFormData, credentials: "include" });
                const musicData = await parseJsonResponse(musicRes);
                if (!musicRes.ok) {
                    setUploading(false);
                    alert(musicData.error || "Upload nhạc thất bại");
                    setSaving(false);
                    return;
                }
                finalMusicUrl = musicData.url ?? null;
                setUploading(false);
            } else if (musicSource === "url") {
                const url = musicCustomUrl?.trim();
                if (url) {
                    if (!url.startsWith("http://") && !url.startsWith("https://")) {
                        alert("URL nhạc phải bắt đầu bằng http:// hoặc https://");
                        setSaving(false);
                        return;
                    }
                    finalMusicUrl = url;
                }
            }
            updateData.musicUrl = finalMusicUrl;

            const res = await fetch(`/api/admin/cards/${card._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
                credentials: "include",
            });

            const data = await parseJsonResponse(res);
            if (res.ok && data.ok) {
                onSuccess();
            } else {
                alert("Không thể cập nhật thiệp: " + (data.error || "Lỗi không xác định"));
            }
        } catch (error) {
            console.error("Error updating card:", error);
            const msg = error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật thiệp!";
            alert(msg);
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                    width: "100%",
                    maxWidth: "1200px",
                    height: "90vh",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: TEXT_SECONDARY,
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        transition: "all 0.2s",
                        zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#F3F4F6";
                        e.currentTarget.style.color = TEXT_PRIMARY;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = TEXT_SECONDARY;
                    }}
                >
                    ×
                </button>

                <div style={{ padding: "32px", display: "flex", flexDirection: "column", height: "100%", maxHeight: "90vh" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "24px", flexShrink: 0 }}>
                        Chỉnh Sửa Thiệp
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", flex: 1, minHeight: 0 }}>
                        {/* Form Section */}
                        <div style={{ display: "flex", flexDirection: "column", overflowY: "auto" }}>
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {/* Occasion Display (Read-only) */}
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "8px" }}>
                                        Dịp 🎉
                                    </label>
                                    <div style={{
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: `2px solid ${BORDER_COLOR}`,
                                        backgroundColor: "#F9FAFB",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}>
                                        <span style={{ fontSize: "20px" }}>
                                            {occasion === "newyear" ? "🎆" : occasion === "valentine" ? "💕" : "🌸"}
                                        </span>
                                        <span style={{ fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY }}>
                                            {occasion === "newyear" ? "Năm Mới" : occasion === "valentine" ? "Valentine" : "8/3"}
                                        </span>
                                    </div>
                                </div>

                                {/* Recipient Name */}
                                <div>
                                    <label htmlFor="recipient" style={{ display: "block", fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "8px" }}>
                                        Gửi Đến 💌
                                    </label>
                                    <input
                                        id="recipient"
                                        type="text"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        placeholder="Tên người nhận..."
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            border: `1px solid ${BORDER_COLOR}`,
                                            fontSize: "14px",
                                            outline: "none",
                                        }}
                                    />
                                </div>

                                {/* Sender Name */}
                                <div>
                                    <label htmlFor="sender" style={{ display: "block", fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "8px" }}>
                                        Người Gửi ✍️
                                    </label>
                                    <input
                                        id="sender"
                                        type="text"
                                        value={sender}
                                        onChange={(e) => setSender(e.target.value)}
                                        placeholder="Tên của bạn..."
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            border: `1px solid ${BORDER_COLOR}`,
                                            fontSize: "14px",
                                            outline: "none",
                                        }}
                                    />
                                </div>

                                {/* Message Type Selection */}
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "8px" }}>
                                        Loại Lời Chúc 💬
                                    </label>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMessageType("custom");
                                                setSelectedDefaultMessage("");
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: "8px 16px",
                                                borderRadius: "8px",
                                                border: `2px solid ${messageType === "custom" ? PRIMARY_COLOR : BORDER_COLOR}`,
                                                backgroundColor: messageType === "custom" ? PRIMARY_COLOR : "#ffffff",
                                                color: messageType === "custom" ? "#ffffff" : TEXT_SECONDARY,
                                                fontWeight: 600,
                                                cursor: "pointer",
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
                                                padding: "8px 16px",
                                                borderRadius: "8px",
                                                border: `2px solid ${messageType === "default" ? PRIMARY_COLOR : BORDER_COLOR}`,
                                                backgroundColor: messageType === "default" ? PRIMARY_COLOR : "#ffffff",
                                                color: messageType === "default" ? "#ffffff" : TEXT_SECONDARY,
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                        >
                                            📝 Lời chúc mẫu
                                        </button>
                                    </div>
                                </div>

                                {/* Custom Message Input */}
                                {messageType === "custom" && (
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                            <label htmlFor="message" style={{ fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY }}>
                                                Nội Dung Lời Chúc
                                            </label>
                                            <span style={{ fontSize: "12px", color: TEXT_TERTIARY }}>
                                                {message.length} / {MAX_MESSAGE_LENGTH}
                                            </span>
                                        </div>
                                        <textarea
                                            id="message"
                                            rows={6}
                                            value={message}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (newValue.length <= MAX_MESSAGE_LENGTH) {
                                                    setMessage(newValue);
                                                }
                                            }}
                                            placeholder="Viết lời chúc của bạn..."
                                            maxLength={MAX_MESSAGE_LENGTH}
                                            required
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                borderRadius: "8px",
                                                border: `1px solid ${BORDER_COLOR}`,
                                                fontSize: "14px",
                                                outline: "none",
                                                resize: "vertical",
                                                fontFamily: "inherit",
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Default Message Selection */}
                                {messageType === "default" && (
                                    <div>
                                        <label htmlFor="default-message-select" style={{ display: "block", fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "8px" }}>
                                            Chọn Lời Chúc Mẫu
                                        </label>
                                        <select
                                            id="default-message-select"
                                            value={selectedDefaultMessage}
                                            onChange={(e) => setSelectedDefaultMessage(e.target.value)}
                                            required
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                borderRadius: "8px",
                                                border: `1px solid ${BORDER_COLOR}`,
                                                fontSize: "14px",
                                                outline: "none",
                                                backgroundColor: "#ffffff",
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
                                    </div>
                                )}

                                {/* Personal Image Upload */}
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "8px" }}>
                                        Ảnh Cá Nhân 📷 (Tùy chọn)
                                    </label>
                                    {/* Tabs: Upload file hoặc URL */}
                                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px", borderBottom: `1px solid ${BORDER_COLOR}` }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPersonalImageSource("file");
                                                setPersonalImageUrl("");
                                                setPersonalImagePreview(null);
                                                const urlInput = document.querySelector('input[name="personalImageUrl"]') as HTMLInputElement;
                                                if (urlInput) urlInput.value = "";
                                            }}
                                            style={{
                                                padding: "8px 16px",
                                                border: "none",
                                                borderBottom: personalImageSource === "file" ? `2px solid ${PRIMARY_COLOR}` : "2px solid transparent",
                                                backgroundColor: "transparent",
                                                color: personalImageSource === "file" ? PRIMARY_COLOR : TEXT_SECONDARY,
                                                fontWeight: personalImageSource === "file" ? 600 : 400,
                                                cursor: "pointer",
                                                fontSize: "14px",
                                            }}
                                        >
                                            📁 Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPersonalImageSource("url");
                                                setPersonalImage(null);
                                                setPersonalImagePreview(card.personalImageUrl || null);
                                                const fileInput = document.querySelector('input[name="personalImage"]') as HTMLInputElement;
                                                if (fileInput) fileInput.value = "";
                                            }}
                                            style={{
                                                padding: "8px 16px",
                                                border: "none",
                                                borderBottom: personalImageSource === "url" ? `2px solid ${PRIMARY_COLOR}` : "2px solid transparent",
                                                backgroundColor: "transparent",
                                                color: personalImageSource === "url" ? PRIMARY_COLOR : TEXT_SECONDARY,
                                                fontWeight: personalImageSource === "url" ? 600 : 400,
                                                cursor: "pointer",
                                                fontSize: "14px",
                                            }}
                                        >
                                            🔗 URL Ảnh
                                        </button>
                                    </div>

                                    {/* File Upload */}
                                    {personalImageSource === "file" && (
                                        <>
                                            <input
                                                name="personalImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        if (!file.type.startsWith("image/")) {
                                                            alert("Vui lòng chọn file ảnh");
                                                            return;
                                                        }
                                                        if (file.size > MAX_IMAGE_BYTES) {
                                                            alert("Ảnh tối đa 10MB");
                                                            return;
                                                        }
                                                        setPersonalImage(file);
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setPersonalImagePreview(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                style={{
                                                    width: "100%",
                                                    padding: "12px",
                                                    borderRadius: "8px",
                                                    border: `1px solid ${BORDER_COLOR}`,
                                                    fontSize: "14px",
                                                }}
                                            />
                                            <p style={{ marginTop: "8px", fontSize: "12px", color: TEXT_TERTIARY }}>
                                                Upload ảnh dọc (portrait) để hiển thị trong thiệp (tối đa 5MB)
                                            </p>
                                        </>
                                    )}

                                    {/* URL Input */}
                                    {personalImageSource === "url" && (
                                        <>
                                            <input
                                                name="personalImageUrl"
                                                type="url"
                                                value={personalImageUrl}
                                                onChange={(e) => {
                                                    const url = e.target.value.trim();
                                                    setPersonalImageUrl(url);
                                                    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
                                                        setPersonalImagePreview(url);
                                                    } else if (!url) {
                                                        setPersonalImagePreview(null);
                                                    }
                                                }}
                                                placeholder="https://example.com/image.jpg"
                                                style={{
                                                    width: "100%",
                                                    padding: "12px",
                                                    borderRadius: "8px",
                                                    border: `1px solid ${BORDER_COLOR}`,
                                                    fontSize: "14px",
                                                    outline: "none",
                                                }}
                                            />
                                            <p style={{ marginTop: "8px", fontSize: "12px", color: TEXT_TERTIARY }}>
                                                Nhập URL ảnh từ internet (phải bắt đầu bằng http:// hoặc https://)
                                            </p>
                                        </>
                                    )}

                                    {/* Preview */}
                                    {personalImagePreview && (
                                        <div style={{ marginTop: "12px", position: "relative", display: "inline-block" }}>
                                            <img
                                                src={personalImagePreview}
                                                alt="Personal Preview"
                                                onError={() => {
                                                    setPersonalImagePreview(null);
                                                    alert("Không thể tải ảnh từ URL này");
                                                }}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "200px",
                                                    borderRadius: "8px",
                                                    border: "1px solid #ddd",
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPersonalImage(null);
                                                    setPersonalImageUrl("");
                                                    setPersonalImagePreview(null);
                                                    setPersonalImageRemoved(true);
                                                    const fileInput = document.querySelector('input[name="personalImage"]') as HTMLInputElement;
                                                    const urlInput = document.querySelector('input[name="personalImageUrl"]') as HTMLInputElement;
                                                    if (fileInput) fileInput.value = "";
                                                    if (urlInput) urlInput.value = "";
                                                }}
                                                style={{
                                                    position: "absolute",
                                                    top: "8px",
                                                    right: "8px",
                                                    width: "28px",
                                                    height: "28px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#EF4444",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "16px",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                                }}
                                                title="Xóa ảnh"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Nhạc nền: không / tải file / nhập URL */}
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "8px" }}>
                                        Nhạc nền 🎵 (Tùy chọn)
                                    </label>
                                    <div style={{ display: "flex", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
                                        {(["none", "file", "url"] as const).map((src) => (
                                            <label
                                                key={src}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                    color: musicSource === src ? PRIMARY_COLOR : TEXT_SECONDARY,
                                                    fontWeight: musicSource === src ? 600 : 400,
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="musicSource"
                                                    checked={musicSource === src}
                                                    onChange={() => setMusicSource(src)}
                                                />
                                                {src === "none" && "Không phát nhạc"}
                                                {src === "file" && "Tải file lên (MP3, ...)"}
                                                {src === "url" && "Nhập URL"}
                                            </label>
                                        ))}
                                    </div>
                                    {musicSource === "file" && (
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            onChange={(e) => setMusicFile(e.target.files?.[0] ?? null)}
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                borderRadius: "8px",
                                                border: `1px solid ${BORDER_COLOR}`,
                                                fontSize: "14px",
                                            }}
                                        />
                                    )}
                                    {musicSource === "url" && (
                                        <>
                                            <input
                                                type="url"
                                                value={musicCustomUrl}
                                                onChange={(e) => setMusicCustomUrl(e.target.value)}
                                                placeholder="https://example.com/audio.mp3"
                                                style={{
                                                    width: "100%",
                                                    marginTop: "4px",
                                                    padding: "12px",
                                                    borderRadius: "8px",
                                                    border: `1px solid ${BORDER_COLOR}`,
                                                    fontSize: "14px",
                                                    outline: "none",
                                                }}
                                            />
                                            <p style={{ marginTop: "6px", fontSize: "12px", color: TEXT_TERTIARY }}>
                                                Dán link trực tiếp tới file nhạc (MP3, ...)
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* QR Image Upload */}
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "8px" }}>
                                        Ảnh QR Code 🔗
                                    </label>
                                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px", borderBottom: "1px solid #e0e0e0" }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setQrImageUrlSource("url");
                                                setQrPreview(null);
                                                const fileInput = document.querySelector('input[name="qrImage"]') as HTMLInputElement;
                                                if (fileInput) fileInput.value = "";
                                            }}
                                            style={{
                                                padding: "8px 16px",
                                                border: "none",
                                                borderBottom: qrImageSource === "url" ? "2px solid #d32f2f" : "2px solid transparent",
                                                backgroundColor: "transparent",
                                                color: qrImageSource === "url" ? "#d32f2f" : "#666",
                                                fontWeight: qrImageSource === "url" ? 600 : 400,
                                                cursor: "pointer",
                                                fontSize: "14px",
                                            }}
                                        >
                                            🔗 URL Ảnh
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setQrImageUrlSource("file");
                                                setQrImageUrl("");
                                                setQrPreview(null);
                                            }}
                                            style={{
                                                padding: "8px 16px",
                                                border: "none",
                                                borderBottom: qrImageSource === "file" ? "2px solid #d32f2f" : "2px solid transparent",
                                                backgroundColor: "transparent",
                                                color: qrImageSource === "file" ? "#d32f2f" : "#666",
                                                fontWeight: qrImageSource === "file" ? 600 : 400,
                                                cursor: "pointer",
                                                fontSize: "14px",
                                            }}
                                        >
                                            📁 Upload File
                                        </button>
                                    </div>

                                    {qrImageSource === "url" && (
                                        <>
                                            <input
                                                type="url"
                                                value={qrImageUrl}
                                                onChange={(e) => {
                                                    const url = e.target.value.trim();
                                                    setQrImageUrl(url);
                                                    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
                                                        setQrPreview(url);
                                                    } else if (!url) {
                                                        setQrPreview(null);
                                                    }
                                                }}
                                                placeholder="https://example.com/qr-image.png"
                                                style={{
                                                    width: "100%",
                                                    padding: "12px",
                                                    borderRadius: "8px",
                                                    border: `1px solid ${BORDER_COLOR}`,
                                                    fontSize: "14px",
                                                    outline: "none",
                                                }}
                                            />
                                            <p style={{ marginTop: "8px", fontSize: "12px", color: TEXT_TERTIARY }}>
                                                Nhập URL ảnh QR từ Canva
                                            </p>
                                        </>
                                    )}

                                    {qrImageSource === "file" && (
                                        <>
                                            <input
                                                name="qrImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleQrImageChange}
                                                style={{
                                                    width: "100%",
                                                    padding: "12px",
                                                    borderRadius: "8px",
                                                    border: `1px solid ${BORDER_COLOR}`,
                                                    fontSize: "14px",
                                                }}
                                            />
                                            <p style={{ marginTop: "8px", fontSize: "12px", color: TEXT_TERTIARY }}>
                                                Upload ảnh QR code (tối đa 5MB)
                                            </p>
                                        </>
                                    )}

                                    {qrPreview && (
                                        <div style={{ marginTop: "12px", position: "relative", display: "inline-block" }}>
                                            <img
                                                src={qrPreview}
                                                alt="QR Preview"
                                                onError={() => {
                                                    setQrPreview(null);
                                                    alert("Không thể tải ảnh từ URL này");
                                                }}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "200px",
                                                    borderRadius: "8px",
                                                    border: "1px solid #ddd",
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setQrImageUrl("");
                                                    setQrPreview(null);
                                                    setQrImageRemoved(true);
                                                    setQrImageUrlSource("url");
                                                    const fileInput = document.querySelector('input[name="qrImage"]') as HTMLInputElement;
                                                    if (fileInput) fileInput.value = "";
                                                }}
                                                style={{
                                                    position: "absolute",
                                                    top: "8px",
                                                    right: "8px",
                                                    width: "28px",
                                                    height: "28px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#EF4444",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "16px",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                                }}
                                                title="Xóa ảnh QR"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
                                    <button
                                        type="submit"
                                        disabled={saving || uploading}
                                        style={{
                                            flex: 1,
                                            padding: "12px 24px",
                                            background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #764ba2 100%)`,
                                            color: "#ffffff",
                                            fontWeight: 600,
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: saving || uploading ? "not-allowed" : "pointer",
                                            opacity: saving || uploading ? 0.7 : 1,
                                        }}
                                    >
                                        {uploading ? "Đang upload..." : saving ? "Đang lưu..." : "💾 Lưu Thay Đổi"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        style={{
                                            padding: "12px 24px",
                                            backgroundColor: "#F3F4F6",
                                            color: TEXT_SECONDARY,
                                            fontWeight: 600,
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview Section */}
                        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 600, color: TEXT_PRIMARY, marginBottom: "16px", flexShrink: 0 }}>
                                Xem Trước Thiệp
                            </h3>
                            <div
                                style={{
                                    flex: 1,
                                    borderRadius: "12px",
                                    overflow: "auto",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    minHeight: 0,
                                }}
                            >
                                {/* Card Preview */}
                                <CardPreview
                                    occasion={occasion}
                                    recipient={recipient}
                                    sender={sender}
                                    message={displayMessage}
                                    personalImageUrl={personalImagePreview || undefined}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

