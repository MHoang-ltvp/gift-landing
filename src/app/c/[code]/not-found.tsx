export default function NotFound() {
    return (
        <main
            style={{
                minHeight: "100vh",
                padding: 24,
                fontFamily: "system-ui",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: 48, marginBottom: 16 }}>404</h1>
                <p style={{ fontSize: 18, color: "#666" }}>Thiệp không tồn tại</p>
                <p style={{ fontSize: 14, color: "#999", marginTop: 8 }}>
                    Có thể mã QR không đúng hoặc thiệp đã bị xóa.
                </p>
            </div>
        </main>
    );
}

