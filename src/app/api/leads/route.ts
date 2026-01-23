import { getDb } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));

    const lead = {
        name: body.name?.toString().trim() || "",
        phone: body.phone?.toString().trim() || "",
        email: body.email?.toString().trim() || "",
        occasion: body.occasion || "",
        note: body.note?.toString().trim() || "",
        createdAt: new Date().toISOString(),
    };

    // validate tối thiểu: phải có phone hoặc email
    if (!lead.phone && !lead.email) {
        return Response.json({ error: "Phone or email is required" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("leads").insertOne(lead);

    return Response.json({ ok: true });
}
