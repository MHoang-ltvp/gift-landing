import AdminCard from "./components/AdminCard";

export default function AdminHome() {
    return (
        <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, marginBottom: 8 }}>Admin Dashboard</h1>
            <p style={{ color: "#666", marginBottom: 32 }}>Quản lý sản phẩm và thiệp chúc mừng</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                <AdminCard
                    href="/admin/products"
                    title="Quản lý Sản phẩm"
                    description="Tạo và quản lý sản phẩm quà tặng"
                    color="#1976d2"
                />
                <AdminCard
                    href="/admin/cards"
                    title="Quản lý Thiệp"
                    description="Tạo thiệp chúc mừng và tải QR code"
                    color="#4caf50"
                />
            </div>

            <div style={{ marginTop: 32, padding: 20, backgroundColor: "#f8f9fa", borderRadius: 8 }}>
                <h2 style={{ fontSize: 20, marginBottom: 12 }}>🧪 Test Pages</h2>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a
                        href="/admin/test"
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#17a2b8",
                            color: "#fff",
                            textDecoration: "none",
                            borderRadius: 4,
                            fontSize: 14,
                        }}
                    >
                        ✅ Test Middleware
                    </a>
                    <a
                        href="/admin/test-auth"
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#ffc107",
                            color: "#000",
                            textDecoration: "none",
                            borderRadius: 4,
                            fontSize: 14,
                        }}
                    >
                        🔐 Test Basic Auth
                    </a>
                </div>
            </div>
        </main>
    );
}
