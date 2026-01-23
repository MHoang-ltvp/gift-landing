"use client";

import { useState } from "react";

export default function LeadForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setMessage(null);

                try {
                    const fd = new FormData(e.currentTarget);
                    const phone = fd.get("phone")?.toString().trim() || "";
                    const email = fd.get("email")?.toString().trim() || "";

                    // Validation: phải có phone hoặc email
                    if (!phone && !email) {
                        setMessage({ type: "error", text: "Vui lòng nhập SĐT hoặc Email" });
                        setLoading(false);
                        return;
                    }

                    const body = Object.fromEntries(fd.entries());

                    const res = await fetch("/api/leads", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    });

                    if (res.ok) {
                        setMessage({ type: "success", text: "Đã gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất." });
                        e.currentTarget.reset();
                    } else {
                        const data = await res.json().catch(() => ({}));
                        setMessage({ type: "error", text: data.error || "Gửi thất bại. Vui lòng thử lại." });
                    }
                } catch (error) {
                    setMessage({ type: "error", text: "Có lỗi xảy ra. Vui lòng thử lại." });
                } finally {
                    setLoading(false);
                }
            }}
        >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <input
                    name="name"
                    placeholder="Tên (tùy chọn)"
                    style={{ padding: 12, flex: "1 1 200px", border: "1px solid #ddd", borderRadius: 4 }}
                />
                <input
                    name="phone"
                    type="tel"
                    placeholder="Số điện thoại *"
                    style={{ padding: 12, flex: "1 1 200px", border: "1px solid #ddd", borderRadius: 4 }}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email *"
                    style={{ padding: 12, flex: "1 1 200px", border: "1px solid #ddd", borderRadius: 4 }}
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <select
                    name="occasion"
                    style={{ padding: 12, width: "100%", maxWidth: 300, border: "1px solid #ddd", borderRadius: 4 }}
                >
                    <option value="">Chọn dịp quan tâm (tùy chọn)</option>
                    <option value="tet">Tết</option>
                    <option value="valentine">Valentine</option>
                    <option value="8-3">8/3</option>
                </select>
            </div>

            {message && (
                <div
                    style={{
                        padding: 12,
                        marginBottom: 12,
                        borderRadius: 4,
                        backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                        color: message.type === "success" ? "#155724" : "#721c24",
                        border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                    }}
                >
                    {message.text}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: "12px 24px",
                    backgroundColor: loading ? "#ccc" : "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: 16,
                    fontWeight: 600,
                }}
            >
                {loading ? "Đang gửi..." : "Gửi thông tin"}
            </button>

            <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                * Bắt buộc phải có SĐT hoặc Email
            </p>
        </form>
    );
}
