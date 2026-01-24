import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import CardPreview from "@/app/components/CardPreview";
import type { CardOccasion } from "@/types";

export default async function CardPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    const db = await getDb();
    const card = await db.collection("cards").findOne({ code });

    if (!card) {
        notFound();
    }

    const cardData = card as any;
    const occasion = (cardData.occasion || "newyear") as CardOccasion;
    const payload = cardData.payload || {};

    return (
        <main
            style={{
                minHeight: "100vh",
                padding: 24,
                fontFamily: "'Be Vietnam Pro', sans-serif",
                background: "linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    maxWidth: 800,
                    width: "100%",
                    margin: "0 auto",
                }}
            >
                <div
                    style={{
                        aspectRatio: "3/4",
                        borderRadius: 24,
                        overflow: "hidden",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        maxWidth: 600,
                        margin: "0 auto",
                    }}
                >
                    <CardPreview
                        occasion={occasion}
                        recipient={payload.toName || ""}
                        sender={payload.fromName || ""}
                        message={payload.message || ""}
                    />
                </div>
            </div>
        </main>
    );
}
