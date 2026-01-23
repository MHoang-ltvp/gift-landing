import { getDb } from "@/lib/db";
import { nanoid } from "nanoid";

function getBaseUrl() {
  return process.env.BASE_URL || "http://localhost:3000";
}

export async function GET() {
  const db = await getDb();
  const cards = await db.collection("cards").find({}).sort({ createdAt: -1 }).toArray();
  return Response.json({ cards });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const template = body.template?.toString().trim();
  const payload = body.payload && typeof body.payload === "object" ? body.payload : {};

  if (!template) {
    return Response.json({ error: "template is required" }, { status: 400 });
  }

  const db = await getDb();

  // Tạo code ngắn, đảm bảo unique
  let code = "";
  for (let i = 0; i < 5; i++) {
    const candidate = nanoid(8);
    const exists = await db.collection("cards").findOne({ code: candidate });
    if (!exists) {
      code = candidate;
      break;
    }
  }
  if (!code) {
    return Response.json({ error: "Failed to generate code" }, { status: 500 });
  }

  const card = {
    code,
    template,
    payload: {
      toName: payload.toName?.toString().trim() || "",
      fromName: payload.fromName?.toString().trim() || "",
      message: payload.message?.toString().trim() || "",
    },
    createdAt: new Date().toISOString(),
  };

  const r = await db.collection("cards").insertOne(card);

  const url = `${getBaseUrl()}/c/${code}`;
  return Response.json({ ok: true, id: r.insertedId, code, url });
}
