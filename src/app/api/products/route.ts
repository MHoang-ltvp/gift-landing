import { getDb } from "@/lib/db";

// Public API: chỉ trả về sản phẩm active
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const occasion = searchParams.get("occasion");

    const db = await getDb();
    const query: any = { active: true };
    
    if (occasion && ["tet", "valentine", "8-3"].includes(occasion)) {
        query.occasion = occasion;
    }

    const products = await db
        .collection("products")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

    return Response.json({ products });
}

