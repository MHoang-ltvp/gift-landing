import { redirect } from "next/navigation";

async function getCards() {
    const res = await fetch(`${process.env.BASE_URL}/api/admin/cards`, { cache: "no-store" });
    return res.json();
}

export default async function AdminCards() {
    const data = await getCards();
    const cards = data.cards || [];

    return (
        <main style={{ padding: 24, fontFamily: "system-ui" }}>
            <div style={{ marginBottom: 16 }}>
                <a href="/admin" style={{ color: "#1976d2", textDecoration: "none" }}>← Về Admin</a>
            </div>
            <h1>Quản lý Thiệp</h1>

            <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8, marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, marginBottom: 12 }}>Tạo thiệp mới</h2>
                <form
                    action={async (formData) => {
                        "use server";
                        const body = {
                            template: String(formData.get("template") || "tet_01"),
                            payload: {
                                toName: String(formData.get("toName") || ""),
                                fromName: String(formData.get("fromName") || ""),
                                message: String(formData.get("message") || ""),
                            },
                        };

                        await fetch(`${process.env.BASE_URL}/api/admin/cards`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body),
                        });
                        
                        redirect("/admin/cards");
                    }}
                >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                        <input
                            name="template"
                            defaultValue="tet_01"
                            placeholder="Template (vd: tet_01)"
                            style={{ padding: 10, flex: "1 1 200px", border: "1px solid #ddd", borderRadius: 4 }}
                        />
                        <input
                            name="toName"
                            placeholder="Người nhận"
                            style={{ padding: 10, flex: "1 1 200px", border: "1px solid #ddd", borderRadius: 4 }}
                        />
                        <input
                            name="fromName"
                            placeholder="Người gửi"
                            style={{ padding: 10, flex: "1 1 200px", border: "1px solid #ddd", borderRadius: 4 }}
                        />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <textarea
                            name="message"
                            placeholder="Lời chúc"
                            style={{ padding: 10, width: "100%", height: 120, border: "1px solid #ddd", borderRadius: 4, fontFamily: "inherit" }}
                        />
                    </div>
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
                        Tạo thiệp
                    </button>
                </form>
            </div>

            <div style={{ marginTop: 24 }}>
                <h2 style={{ fontSize: 20, marginBottom: 16 }}>Danh sách thiệp ({cards.length})</h2>
                {cards.length === 0 ? (
                    <p style={{ color: "#666" }}>Chưa có thiệp nào. Hãy tạo thiệp đầu tiên!</p>
                ) : (
                    cards.map((c: any) => (
                        <div key={c._id} style={{ padding: 16, border: "1px solid #e0e0e0", borderRadius: 8, marginBottom: 12, backgroundColor: "#fff" }}>
                            <div style={{ marginBottom: 8 }}>
                                <b style={{ fontSize: 18 }}>Code: {c.code}</b>
                                <span style={{ marginLeft: 12, padding: "4px 8px", backgroundColor: "#e3f2fd", borderRadius: 4, fontSize: 14 }}>
                                    {c.template}
                                </span>
                            </div>
                            {c.payload?.toName && (
                                <p style={{ margin: "4px 0", color: "#666" }}>
                                    Gửi đến: <strong>{c.payload.toName}</strong>
                                    {c.payload.fromName && ` từ ${c.payload.fromName}`}
                                </p>
                            )}
                            <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                                <a
                                    href={`/c/${c.code}`}
                                    target="_blank"
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#1976d2",
                                        color: "#fff",
                                        textDecoration: "none",
                                        borderRadius: 4,
                                        fontSize: 14,
                                    }}
                                >
                                    Mở thiệp
                                </a>
                                <a
                                    href={`/api/admin/cards/${c._id}/qr`}
                                    target="_blank"
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#4caf50",
                                        color: "#fff",
                                        textDecoration: "none",
                                        borderRadius: 4,
                                        fontSize: 14,
                                    }}
                                >
                                    Tải QR (PNG)
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
