"use client";

import { useState, useEffect } from "react";

export default function TestAuthPage() {
    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Test API endpoint với Basic Auth
        fetch("/api/admin/cards", {
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) {
                    setStatus("authenticated");
                    setMessage("✅ API call thành công - Basic Auth đang hoạt động!");
                } else if (res.status === 401) {
                    setStatus("unauthenticated");
                    setMessage("❌ 401 Unauthorized - Cần đăng nhập Basic Auth");
                } else {
                    setStatus("error");
                    setMessage(`❌ Lỗi: ${res.status} ${res.statusText}`);
                }
            })
            .catch((err) => {
                setStatus("error");
                setMessage(`❌ Lỗi: ${err.message}`);
            });
    }, []);

    return (
        <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, marginBottom: 16 }}>🔐 Test Basic Auth</h1>

            <div style={{ 
                padding: 20, 
                backgroundColor: status === "authenticated" ? "#d4edda" : status === "unauthenticated" ? "#fff3cd" : "#f8d7da",
                border: `1px solid ${status === "authenticated" ? "#c3e6cb" : status === "unauthenticated" ? "#ffeaa7" : "#f5c6cb"}`,
                borderRadius: 8,
                marginBottom: 24 
            }}>
                <h2 style={{ margin: "0 0 8px 0" }}>
                    {status === "loading" && "⏳ Đang kiểm tra..."}
                    {status === "authenticated" && "✅ Đã xác thực"}
                    {status === "unauthenticated" && "⚠️ Chưa xác thực"}
                    {status === "error" && "❌ Lỗi"}
                </h2>
                <p style={{ margin: 0 }}>{message || "Đang kiểm tra Basic Auth..."}</p>
            </div>

            <div style={{ padding: 20, backgroundColor: "#f8f9fa", borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>Hướng dẫn:</h3>
                <ol style={{ lineHeight: 1.8 }}>
                    <li>Nếu thấy <strong>"Chưa xác thực"</strong> → Refresh trang và nhập Basic Auth credentials</li>
                    <li>Nếu thấy <strong>"Đã xác thực"</strong> → Middleware và Basic Auth hoạt động đúng!</li>
                    <li>Để test lại, mở <strong>Incognito/Private window</strong> và truy cập lại</li>
                </ol>
            </div>

            <div style={{ marginTop: 24 }}>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 16,
                        marginRight: 12,
                    }}
                >
                    🔄 Test lại
                </button>
                <a 
                    href="/admin" 
                    style={{ 
                        padding: "12px 24px", 
                        backgroundColor: "#6c757d", 
                        color: "#fff", 
                        textDecoration: "none", 
                        borderRadius: 4,
                        display: "inline-block"
                    }}
                >
                    ← Về Admin
                </a>
            </div>
        </main>
    );
}

