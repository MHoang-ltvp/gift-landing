import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function CardPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    const db = await getDb();
    const card = await db.collection("cards").findOne({ code });

    if (!card) {
        notFound();
    }

    const { template, payload } = card as any;

    return (
        <main
            style={{
                minHeight: "100vh",
                padding: 24,
                fontFamily: "system-ui, -apple-system, sans-serif",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    maxWidth: 600,
                    width: "100%",
                    margin: "0 auto",
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    padding: 40,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
            >
                {payload?.toName && (
                    <div style={{ marginBottom: 24, color: "#666", fontSize: 14 }}>
                        Gửi đến: <strong>{payload.toName}</strong>
                    </div>
                )}

                <div
                    style={{
                        fontSize: 32,
                        fontWeight: 700,
                        marginBottom: 24,
                        color: "#333",
                        lineHeight: 1.2,
                    }}
                >
                    {payload?.message || "Chúc bạn một ngày thật vui!"}
                </div>

                {payload?.fromName && (
                    <div
                        style={{
                            marginTop: 32,
                            paddingTop: 24,
                            borderTop: "1px solid #eee",
                            textAlign: "right",
                            color: "#666",
                        }}
                    >
                        <div style={{ fontSize: 18, fontWeight: 600, color: "#333" }}>
                            — {payload.fromName}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: 24, fontSize: 12, color: "#999", textAlign: "center" }}>
                    Template: {template}
                </div>
            </div>
        </main>
    );
}
