import { redirect } from "next/navigation";

async function getProducts() {
    const res = await fetch(`${process.env.BASE_URL}/api/admin/products`, { cache: "no-store" });
    return res.json();
}

export default async function AdminProducts() {
    // NOTE: Khi chạy local, process.env.BASE_URL là localhost OK.
    // Trên Vercel, BASE_URL phải set đúng domain production.
    const data = await getProducts();
    const products = data.products || [];

    return (
        <main style={{ padding: 24, fontFamily: "system-ui" }}>
            <div style={{ marginBottom: 16 }}>
                <a href="/admin" style={{ color: "#1976d2", textDecoration: "none" }}>← Về Admin</a>
            </div>
            <h1>Quản lý Sản phẩm</h1>

            <div style={{ padding: 20, backgroundColor: "#f5f5f5", borderRadius: 8, marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, marginBottom: 12 }}>Tạo sản phẩm mới</h2>
                <form
                    action={async (formData) => {
                        "use server";
                        const body = {
                            title: String(formData.get("title") || ""),
                            occasion: String(formData.get("occasion") || "tet"),
                            active: true,
                        };

                        if (!body.title.trim()) {
                            return;
                        }

                        // gọi internal API qua fetch relative (server side)
                        await fetch(`${process.env.BASE_URL}/api/admin/products`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body),
                        });
                        
                        redirect("/admin/products");
                    }}
                >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                        <input
                            name="title"
                            placeholder="Tên sản phẩm"
                            required
                            style={{ padding: 10, flex: "1 1 300px", border: "1px solid #ddd", borderRadius: 4 }}
                        />
                        <select
                            name="occasion"
                            style={{ padding: 10, flex: "1 1 200px", border: "1px solid #ddd", borderRadius: 4 }}
                        >
                            <option value="tet">Tết</option>
                            <option value="valentine">Valentine</option>
                            <option value="8-3">8/3</option>
                        </select>
                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#1976d2",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: 16,
                                fontWeight: 600,
                            }}
                        >
                            Tạo sản phẩm
                        </button>
                    </div>
                </form>
            </div>

            <div style={{ marginTop: 24 }}>
                <h2 style={{ fontSize: 20, marginBottom: 16 }}>Danh sách sản phẩm ({products.length})</h2>
                {products.length === 0 ? (
                    <p style={{ color: "#666" }}>Chưa có sản phẩm nào. Hãy tạo sản phẩm đầu tiên!</p>
                ) : (
                    products.map((p: any) => (
                        <div key={p._id} style={{ padding: 16, border: "1px solid #e0e0e0", borderRadius: 8, marginBottom: 12, backgroundColor: "#fff" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <b style={{ fontSize: 18 }}>{p.title}</b>
                                    <span style={{ marginLeft: 12, padding: "4px 8px", backgroundColor: "#e3f2fd", borderRadius: 4, fontSize: 14 }}>
                                        {p.occasion}
                                    </span>
                                    <span style={{ marginLeft: 8, padding: "4px 8px", backgroundColor: p.active ? "#c8e6c9" : "#ffcdd2", borderRadius: 4, fontSize: 14 }}>
                                        {p.active ? "✓ Active" : "✗ Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
