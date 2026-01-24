import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { requireAdminOrResponse } from "@/lib/adminAuth";

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
    const auth = await requireAdminOrResponse();
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;

        if (!ObjectId.isValid(id)) {
            return Response.json({ error: "Invalid card ID" }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.collection("cards").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return Response.json({ error: "Card not found" }, { status: 404 });
        }

        return Response.json({ ok: true });
    } catch (error) {
        console.error("Error deleting card:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

