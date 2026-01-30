import { getDb } from "@/lib/db";
import { requireAdminOrResponse } from "@/lib/adminAuth";
import type { Settings } from "@/types";

// Get settings (public - for footer)
export async function GET() {
    const db = await getDb();
    const settings = await db.collection("settings").findOne({});

    if (!settings) {
        // Return default settings
        return Response.json({
            contactInfo: {
                hotline: "0968118025",
                email: "goighem2026@gmail.com",
            },
            addresses: [
                "81 Bà Triệu, Hai Bà Trưng",
                "241 Chùa Bộc, Đống Đa",
                "60 Trần Đại Nghĩa, Hai Bà Trưng",
                "226 Nguyễn Trãi, Nam Từ Liêm (gần ĐH Hà Nội)",
                "157 Xuân Thủy, Cầu Giấy",
            ],
            socialLinks: {
                instagram: { enabled: true, url: "#" },
                facebook: { enabled: true, url: "#" },
                youtube: { enabled: true, url: "#" },
                tiktok: { enabled: true, url: "#" },
            },
            googleSheets: {
                enabled: false,
                webhookUrl: "",
            },
        });
    }

    // Remove _id and return
    const { _id, ...settingsData } = settings;
    return Response.json(settingsData);
}

// Update settings (admin only)
export async function PUT(req: Request) {
    const auth = await requireAdminOrResponse();
    if (auth instanceof Response) return auth;

    try {
        const body = await req.json().catch(() => ({}));

        const db = await getDb();

        // Validate social links structure
        const socialLinks = body.socialLinks || {};
        const validatedSocialLinks: Settings["socialLinks"] = {
            instagram: {
                enabled: socialLinks.instagram?.enabled ?? false,
                url: socialLinks.instagram?.url?.toString().trim() || "#",
            },
            facebook: {
                enabled: socialLinks.facebook?.enabled ?? false,
                url: socialLinks.facebook?.url?.toString().trim() || "#",
            },
            youtube: {
                enabled: socialLinks.youtube?.enabled ?? false,
                url: socialLinks.youtube?.url?.toString().trim() || "#",
            },
            tiktok: {
                enabled: socialLinks.tiktok?.enabled ?? false,
                url: socialLinks.tiktok?.url?.toString().trim() || "#",
            },
        };

        // Validate Google Sheets
        const googleSheets = body.googleSheets || {};
        const validatedGoogleSheets: Settings["googleSheets"] = {
            enabled: googleSheets.enabled ?? false,
            webhookUrl: googleSheets.webhookUrl?.toString().trim() || "",
        };

        // Validate webhook URL if enabled
        if (validatedGoogleSheets.enabled && !validatedGoogleSheets.webhookUrl) {
            return Response.json(
                { error: "Google Sheets webhook URL is required when enabled" },
                { status: 400 }
            );
        }

        // Validate Contact Info
        const contactInfo = body.contactInfo || {};
        const validatedContactInfo: Settings["contactInfo"] = {
            hotline: contactInfo.hotline?.toString().trim() || "0968118025",
            email: contactInfo.email?.toString().trim() || "goighem2026@gmail.com",
        };

        // Validate Email format
        if (validatedContactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validatedContactInfo.email)) {
            return Response.json(
                { error: "Email không đúng định dạng" },
                { status: 400 }
            );
        }

        // Validate Addresses
        const addresses = body.addresses || [];
        const validatedAddresses: string[] = Array.isArray(addresses)
            ? addresses
                .map((addr: any) => addr?.toString().trim())
                .filter((addr: string) => addr && addr.length > 0)
            : [];

        const settings: Omit<Settings, "_id"> = {
            contactInfo: validatedContactInfo,
            addresses: validatedAddresses,
            socialLinks: validatedSocialLinks,
            googleSheets: validatedGoogleSheets,
            updatedAt: new Date().toISOString(),
        };

        // Upsert settings (only one settings document)
        await db.collection("settings").updateOne(
            {},
            { $set: settings },
            { upsert: true }
        );

        return Response.json({ ok: true, settings });
    } catch (error) {
        console.error("Error updating settings:", error);
        return Response.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}

