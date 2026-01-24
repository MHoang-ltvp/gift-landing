"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const redirect = searchParams.get("redirect") || "/admin";
    const errorParam = searchParams.get("error");

    useEffect(() => {
        if (errorParam === "invalid_token") {
            setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }
    }, [errorParam]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Login thành công → redirect
                router.push(redirect);
                router.refresh();
            } else {
                setError(data.error || "Đăng nhập thất bại");
            }
        } catch (err) {
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "system-ui",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 400,
                    padding: 40,
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
            >
                <h1 style={{ fontSize: 28, marginBottom: 8, textAlign: "center" }}>
                    🔐 Admin Login
                </h1>
                <p style={{ color: "#666", marginBottom: 24, textAlign: "center" }}>
                    Đăng nhập để truy cập trang quản trị
                </p>

                {error && (
                    <div
                        style={{
                            padding: 12,
                            marginBottom: 20,
                            backgroundColor: "#f8d7da",
                            color: "#721c24",
                            border: "1px solid #f5c6cb",
                            borderRadius: 4,
                            fontSize: 14,
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label
                            htmlFor="username"
                            style={{
                                display: "block",
                                marginBottom: 8,
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#333",
                            }}
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: 12,
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                fontSize: 16,
                                boxSizing: "border-box",
                            }}
                            placeholder="Nhập username"
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: "block",
                                marginBottom: 8,
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#333",
                            }}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: 12,
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                fontSize: 16,
                                boxSizing: "border-box",
                            }}
                            placeholder="Nhập password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: 14,
                            backgroundColor: loading ? "#ccc" : "#1976d2",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <div style={{ marginTop: 24, fontSize: 12, color: "#999", textAlign: "center" }}>
                    <p>Mặc định: admin / admin123</p>
                    <p>(Thay đổi trong .env: ADMIN_USER, ADMIN_PASS)</p>
                </div>
            </div>
        </main>
    );
}

