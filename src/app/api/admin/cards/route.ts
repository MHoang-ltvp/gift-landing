import { getDb } from "@/lib/db";
import { nanoid } from "nanoid";
import { requireAdminOrResponse } from "@/lib/adminAuth";

function getBaseUrl() {
  return process.env.BASE_URL || "http://localhost:3000";
}

export async function GET() {
  const auth = await requireAdminOrResponse();
  if (auth instanceof Response) return auth;

  const db = await getDb();
  const cards = await db.collection("cards").find({}).sort({ createdAt: -1 }).toArray();
  return Response.json({ cards });
}

export async function POST(req: Request) {
  const auth = await requireAdminOrResponse();
  if (auth instanceof Response) return auth;

  const body = await req.json().catch(() => ({}));

  const template = body.template?.toString().trim() || "";
  const occasion = body.occasion?.toString().trim() || "";
  const payload = body.payload && typeof body.payload === "object" ? body.payload : {};

  if (!template && !occasion) {
    return Response.json({ error: "template or occasion is required" }, { status: 400 });
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

  const card: any = {
    code,
    payload: {
      toName: payload.toName?.toString().trim() || "",
      fromName: payload.fromName?.toString().trim() || "",
      message: payload.message?.toString().trim() || "",
    },
    createdAt: new Date().toISOString(),
  };

  if (template) card.template = template;
  if (occasion) card.occasion = occasion;
  if (body.personalImageUrl) card.personalImageUrl = body.personalImageUrl.toString().trim();
  if (body.qrImageUrl) card.qrImageUrl = body.qrImageUrl.toString().trim();
  if (body.musicUrl !== undefined) card.musicUrl = body.musicUrl ? body.musicUrl.toString().trim() : null;

  const r = await db.collection("cards").insertOne(card);

  const url = `${getBaseUrl()}/c/${code}`;
  return Response.json({ ok: true, id: r.insertedId, code, url });
}
