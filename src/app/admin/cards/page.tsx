async function getCards() {
    const res = await fetch(`${process.env.BASE_URL}/api/admin/cards`, { cache: "no-store" });
    return res.json();
}

export default async function AdminCards() {
    const data = await getCards();
    const cards = data.cards || [];

    return (
        <main style={{ padding: 24, fontFamily: "system-ui" }}>
            <h1>Cards</h1>

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
                }}
            >
                <input name="template" defaultValue="tet_01" style={{ padding: 8, width: 180 }} />
                <input name="toName" placeholder="To" style={{ padding: 8, width: 180, marginLeft: 8 }} />
                <input name="fromName" placeholder="From" style={{ padding: 8, width: 180, marginLeft: 8 }} />
                <div style={{ marginTop: 8 }}>
                    <textarea name="message" placeholder="Lời chúc" style={{ padding: 8, width: 560, height: 120 }} />
                </div>
                <button style={{ padding: "8px 12px", marginTop: 8 }}>Tạo thiệp</button>
            </form>

            <div style={{ marginTop: 16 }}>
                {cards.map((c: any) => (
                    <div key={c._id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 12, marginBottom: 8 }}>
                        <div><b>{c.code}</b> — {c.template}</div>
                        <div style={{ marginTop: 6 }}>
                            <a href={`/c/${c.code}`} target="_blank">Mở thiệp</a>
                            {" · "}
                            <a href={`/api/admin/cards/${c._id}/qr`} target="_blank">Tải QR (PNG)</a>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
