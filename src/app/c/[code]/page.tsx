import { getDb } from "@/lib/db";

export default async function CardPage({ params }: { params: { code: string } }) {
    const db = await getDb();
    const card = await db.collection("cards").findOne({ code: params.code });

    if (!card) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Thiệp không tồn tại</h1>
            </main>
        );
    }

    const { template, payload } = card as any;

    return (
        <main style={{ padding: 24, fontFamily: "system-ui" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", border: "1px solid #eee", borderRadius: 16, padding: 24 }}>
                <div style={{ opacity: 0.6, marginBottom: 12 }}>Template: {template}</div>
                <h1 style={{ margin: 0 }}>Gửi {payload?.toName || "bạn"}</h1>
                <p style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
                    {payload?.message || "Chúc bạn một ngày thật vui!"}
                </p>
                <p style={{ marginTop: 24, fontWeight: 600 }}>
                    — {payload?.fromName || "Ẩn danh"}
                </p>
            </div>
        </main>
    );
}
