import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { requireAdminOrResponse } from "@/lib/adminAuth";

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
    const auth = await requireAdminOrResponse();
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;

        if (!ObjectId.isValid(id)) {
            return Response.json({ error: "Invalid product ID" }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return Response.json({ error: "Product not found" }, { status: 404 });
        }

        return Response.json({ ok: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
    const auth = await requireAdminOrResponse();
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;

        if (!ObjectId.isValid(id)) {
            return Response.json({ error: "Invalid product ID" }, { status: 400 });
        }

        const body = await req.json().catch(() => ({}));

        const db = await getDb();
        const updateData: any = {};

        if (typeof body.active === "boolean") {
            updateData.active = body.active;
        }

        if (body.title !== undefined) {
            updateData.title = body.title?.toString().trim() || "";
        }

        if (body.price !== undefined) {
            const price = typeof body.price === "number" ? body.price : parseFloat(body.price);
            updateData.price = isNaN(price) ? null : price;
        }

        if (body.description !== undefined) {
            updateData.description = body.description?.toString().trim() || null;
        }

        if (body.image !== undefined) {
            updateData.image = body.image?.toString().trim() || null;
        }

        if (body.occasion !== undefined) {
            updateData.occasion = body.occasion?.toString().trim() || "tet";
        }

        if (Object.keys(updateData).length === 0) {
            return Response.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const result = await db.collection("products").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return Response.json({ error: "Product not found" }, { status: 404 });
        }

        return Response.json({ ok: true });
    } catch (error) {
        console.error("Error updating product:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

