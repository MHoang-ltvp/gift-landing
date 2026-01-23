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
            <h1>Products</h1>

            <form
                action={async (formData) => {
                    "use server";
                    const body = {
                        title: String(formData.get("title") || ""),
                        occasion: String(formData.get("occasion") || "tet"),
                        active: true,
                    };

                    // gọi internal API qua fetch relative (server side)
                    await fetch(`${process.env.BASE_URL}/api/admin/products`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    });
                }}
            >
                <input name="title" placeholder="Tên sản phẩm" style={{ padding: 8, width: 320 }} />
                <select name="occasion" style={{ padding: 8, marginLeft: 8 }}>
                    <option value="tet">Tết</option>
                    <option value="valentine">Valentine</option>
                    <option value="8-3">8/3</option>
                </select>
                <button style={{ padding: "8px 12px", marginLeft: 8 }}>Tạo</button>
            </form>

            <div style={{ marginTop: 16 }}>
                {products.map((p: any) => (
                    <div key={p._id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 12, marginBottom: 8 }}>
                        <b>{p.title}</b> — {p.occasion} — {p.active ? "active" : "inactive"}
                    </div>
                ))}
            </div>
        </main>
    );
}
