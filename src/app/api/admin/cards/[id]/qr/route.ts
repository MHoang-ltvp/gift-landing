import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { makeQrPng } from "@/lib/qr";
import { requireAdminOrResponse } from "@/lib/adminAuth";

function getBaseUrl() {
    return process.env.BASE_URL || "http://localhost:3000";
}

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const auth = await requireAdminOrResponse();
        if (auth instanceof Response) return auth;

        const { id } = await ctx.params;

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return new Response("Invalid card ID", { status: 400 });
        }

        const db = await getDb();
        const card = await db.collection("cards").findOne({ _id: new ObjectId(id) });

        if (!card) {
            return new Response("Card not found", { status: 404 });
        }

        const url = `${getBaseUrl()}/c/${card.code}`;
        const png = await makeQrPng(url);

        return new Response(png, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
