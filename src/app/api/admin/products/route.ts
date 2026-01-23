import { getDb } from "@/lib/db";

export async function GET() {
    const db = await getDb();
    const products = await db
        .collection("products")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    return Response.json({ products });
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));

    if (!body.title || !body.occasion) {
        return Response.json({ error: "title and occasion are required" }, { status: 400 });
    }

    const product = {
        title: body.title.toString().trim(),
        price: typeof body.price === "number" ? body.price : undefined,
        images: Array.isArray(body.images) ? body.images.map(String) : [],
        occasion: body.occasion, // "tet" | "valentine" | "8-3"
        active: body.active ?? true,
        createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    const r = await db.collection("products").insertOne(product);

    return Response.json({ ok: true, id: r.insertedId });
}
