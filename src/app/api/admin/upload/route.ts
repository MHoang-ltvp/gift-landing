import { NextRequest } from "next/server";
import { requireAdminOrResponse } from "@/lib/adminAuth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    const auth = await requireAdminOrResponse();
    if (auth instanceof Response) return auth;

    // Validate Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return Response.json(
            { error: "Cloudinary configuration is missing. Please check your .env file." },
            { status: 500 }
        );
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return Response.json({ error: "File must be an image" }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return Response.json({ error: "File size must be less than 5MB" }, { status: 400 });
        }

        // Convert File to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "goighem/products",
                        resource_type: "image",
                        transformation: [
                            { width: 800, height: 800, crop: "limit" },
                            { quality: "auto" },
                        ],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        const result = uploadResult as any;

        return Response.json({
            ok: true,
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json(
            { error: error instanceof Error ? error.message : "Upload failed" },
            { status: 500 }
        );
    }
}

