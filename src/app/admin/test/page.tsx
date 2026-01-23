export default function AdminTestPage() {
    return (
        <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, marginBottom: 16 }}>✅ Admin Test Page</h1>
            
            <div style={{ 
                padding: 20, 
                backgroundColor: "#d4edda", 
                border: "1px solid #c3e6cb", 
                borderRadius: 8,
                marginBottom: 24 
            }}>
                <h2 style={{ margin: "0 0 8px 0", color: "#155724" }}>🎉 Middleware hoạt động!</h2>
                <p style={{ margin: 0, color: "#155724" }}>
                    Nếu bạn thấy trang này, nghĩa là bạn đã vượt qua Basic Auth thành công.
                </p>
            </div>

            <div style={{ padding: 20, backgroundColor: "#f8f9fa", borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>Thông tin test:</h3>
                <ul style={{ lineHeight: 1.8 }}>
                    <li><strong>URL:</strong> <code>/admin/test</code></li>
                    <li><strong>Status:</strong> Protected by Basic Auth</li>
                    <li><strong>Middleware:</strong> ✅ Active</li>
                    <li><strong>Authentication:</strong> ✅ Required</li>
                </ul>
            </div>

            <div style={{ marginTop: 24 }}>
                <a 
                    href="/admin" 
                    style={{ 
                        padding: "12px 24px", 
                        backgroundColor: "#1976d2", 
                        color: "#fff", 
                        textDecoration: "none", 
                        borderRadius: 4,
                        display: "inline-block"
                    }}
                >
                    ← Về Admin Dashboard
                </a>
            </div>
        </main>
    );
}

