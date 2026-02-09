import { getDb } from "@/lib/db";
import CardsTableClient from "./CardsTableClient";
import type { Card } from "@/types";

async function getCards() {
    const db = await getDb();
    const cards = await db.collection("cards").find({}).sort({ createdAt: -1 }).toArray();

    return cards.map((card: any) => ({
        _id: card._id.toString(),
        code: card.code,
        occasion: card.occasion,
        payload: card.payload,
        personalImageUrl: card.personalImageUrl,
        qrImageUrl: card.qrImageUrl,
        musicUrl: card.musicUrl ?? undefined,
        createdAt: card.createdAt,
    })) as Card[];
}

export default async function AdminCards() {
    const cards = await getCards();

    return (
        <div style={{ fontFamily: "system-ui" }}>
            <div style={{ maxWidth: 1400, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <h1
                        style={{
                            fontSize: "30px",
                            fontWeight: 700,
                            color: "#1F2937",
                            margin: 0,
                        }}
                    >
                        Quản lý Thiệp
                    </h1>
                    <p style={{ color: "#6B7280", marginTop: 8, fontSize: "14px" }}>
                        Tổng số thiệp: {cards.length}
                    </p>
                    </div>

                {/* Cards List with Actions */}
                <CardsTableClient initialCards={cards} />
                </div>
            </div>
    );
}
