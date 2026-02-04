import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import CardPreview from "@/app/components/CardPreview";
import CardMusicPlayer from "@/app/components/CardMusicPlayer";
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
    const musicUrl = cardData.musicUrl as string | undefined;

    return (
        <main
            style={{
                minHeight: "100vh",
                padding: "clamp(12px, 3vw, 24px)",
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
                <CardMusicPlayer musicUrl={musicUrl} />
                <div
                    style={{
                        aspectRatio: "3/4",
                        borderRadius: "clamp(16px, 4vw, 24px)",
                        overflow: "hidden",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        maxWidth: "min(600px, 95vw)",
                        margin: "0 auto",
                    }}
                >
                    <CardPreview
                        occasion={occasion}
                        recipient={payload.toName || ""}
                        sender={payload.fromName || ""}
                        message={payload.message || ""}
                        personalImageUrl={cardData.personalImageUrl}
                    />
                </div>
            </div>
        </main>
    );
}
