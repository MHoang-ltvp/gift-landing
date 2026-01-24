import { getDb } from "@/lib/db";
import { requireAdminOrResponse } from "@/lib/adminAuth";

export async function GET() {
    const auth = await requireAdminOrResponse();
    if (auth instanceof Response) return auth;

    const db = await getDb();
    const products = await db
        .collection("products")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    return Response.json({ products });
}

export async function POST(req: Request) {
    const auth = await requireAdminOrResponse();
    if (auth instanceof Response) return auth;

    const body = await req.json().catch(() => ({}));

    if (!body.title || !body.occasion) {
        return Response.json({ error: "title and occasion are required" }, { status: 400 });
    }

    const product = {
        title: body.title.toString().trim(),
        price: typeof body.price === "number" ? body.price : undefined,
        description: body.description?.toString().trim() || undefined,
        image: body.image?.toString().trim() || undefined,
        images: Array.isArray(body.images) ? body.images.map(String) : [],
        occasion: body.occasion, // "tet" | "valentine" | "8-3"
        active: body.active ?? true,
        createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    const r = await db.collection("products").insertOne(product);

    return Response.json({ ok: true, id: r.insertedId });
}
