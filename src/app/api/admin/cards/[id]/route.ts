import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { requireAdminOrResponse } from "@/lib/adminAuth";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
    const auth = await requireAdminOrResponse();
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;

        if (!ObjectId.isValid(id)) {
            return Response.json({ error: "Invalid card ID" }, { status: 400 });
        }

        const body = await req.json().catch(() => ({}));
        const db = await getDb();

        const updateData: any = {};

        if (body.occasion !== undefined) {
            updateData.occasion = body.occasion?.toString().trim() || null;
        }

        if (body.payload !== undefined && typeof body.payload === "object") {
            updateData.payload = {
                toName: body.payload.toName?.toString().trim() || "",
                fromName: body.payload.fromName?.toString().trim() || "",
                message: body.payload.message?.toString().trim() || "",
            };
        }

        if (body.personalImageUrl !== undefined) {
            updateData.personalImageUrl = body.personalImageUrl?.toString().trim() || null;
        }

        if (body.qrImageUrl !== undefined) {
            updateData.qrImageUrl = body.qrImageUrl?.toString().trim() || null;
        }

        if (body.musicUrl !== undefined) {
            updateData.musicUrl = body.musicUrl ? body.musicUrl.toString().trim() : null;
        }

        const result = await db.collection("cards").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return Response.json({ error: "Card not found" }, { status: 404 });
        }

        return Response.json({ ok: true });
    } catch (error) {
        console.error("Error updating card:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

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

