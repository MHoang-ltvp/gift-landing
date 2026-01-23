import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { makeQrPng } from "@/lib/qr";

function getBaseUrl() {
    return process.env.BASE_URL || "http://localhost:3000";
}

export async function GET(_: Request, ctx: { params: { id: string } }) {
    const { id } = ctx.params;

    const db = await getDb();
    const card = await db.collection("cards").findOne({ _id: new ObjectId(id) });

    if (!card) {
        return new Response("Not found", { status: 404 });
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
}
