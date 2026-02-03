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

        // Upload to Cloudinary (chỉ folder + resource_type; transformation dùng khi hiển thị URL)
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "goighem/products",
                        resource_type: "image",
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
    } catch (error: unknown) {
        console.error("Upload error:", error);
        const message =
            error instanceof Error
                ? error.message
                : typeof (error as { message?: string })?.message === "string"
                  ? (error as { message: string }).message
                  : "Upload failed";
        return Response.json(
            { error: message },
            { status: 500 }
        );
    }
}

