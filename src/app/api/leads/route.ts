import { getDb } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        const lead = {
            name: body.name?.toString().trim() || "",
            phone: body.phone?.toString().trim() || "",
            email: body.email?.toString().trim() || "",
            occasion: body.occasion || "",
            note: body.note?.toString().trim() || "",
            createdAt: new Date().toISOString(),
        };

        // Validation: Cả phone và email đều bắt buộc
        if (!lead.phone) {
            return Response.json({ error: "Số điện thoại là bắt buộc" }, { status: 400 });
        }

        if (!lead.email) {
            return Response.json({ error: "Email là bắt buộc" }, { status: 400 });
        }

        // Validation: Phone format (VN: 10 số, bắt đầu bằng 0 hoặc +84)
        const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
        const phoneNormalized = lead.phone.replace(/\s+/g, ""); // Remove spaces
        if (!phoneRegex.test(phoneNormalized)) {
            return Response.json(
                { error: "Số điện thoại không đúng định dạng. Vui lòng nhập số điện thoại Việt Nam (ví dụ: 0968118025 hoặc +84968118025)" },
                { status: 400 }
            );
        }

        // Validation: Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(lead.email)) {
            return Response.json(
                { error: "Email không đúng định dạng. Vui lòng nhập email hợp lệ (ví dụ: example@gmail.com)" },
                { status: 400 }
            );
        }

        const db = await getDb();
        await db.collection("leads").insertOne(lead);

        // Try to send to Google Sheets if configured
        try {
            const settings = await db.collection("settings").findOne({});
            if (settings?.googleSheets?.enabled && settings?.googleSheets?.webhookUrl) {
                // Send to Google Sheets asynchronously (don't wait for response)
                fetch(settings.googleSheets.webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: lead.name,
                        phone: lead.phone,
                        email: lead.email,
                        occasion: lead.occasion,
                        note: lead.note,
                        createdAt: lead.createdAt,
                    }),
                }).catch((err) => {
                    console.error("Error sending to Google Sheets:", err);
                    // Don't fail the request if Google Sheets fails
                });
            }
        } catch (sheetsError) {
            console.error("Error processing Google Sheets:", sheetsError);
            // Continue even if Google Sheets fails
        }

        return Response.json({ ok: true, message: "Lead saved successfully" });
    } catch (error) {
        console.error("Error saving lead:", error);
        return Response.json(
            { error: "Failed to save lead. Please try again." },
            { status: 500 }
        );
    }
}
