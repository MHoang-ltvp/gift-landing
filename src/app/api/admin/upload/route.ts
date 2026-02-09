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

        const isImage = file.type.startsWith("image/");
        const name = (file.name || "").toLowerCase();
        const isAudioByType = file.type.startsWith("audio/");
        const isAudioByExt = /\.(mp3|wav|ogg|m4a|aac|webm)$/.test(name);
        const isAudio = isAudioByType || isAudioByExt;

        if (!isImage && !isAudio) {
            return Response.json({ error: "Chỉ chấp nhận file ảnh hoặc file nhạc (MP3, ...)" }, { status: 400 });
        }

        // Giới hạn 4MB để tránh 413 trên Vercel (body limit 4.5MB)
        const maxSize = 4 * 1024 * 1024;
        if (file.size > maxSize) {
            return Response.json({
                error: "File tối đa 4MB (giới hạn server). Dùng file nhỏ hơn hoặc chọn Nhập URL.",
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    isImage
                        ? { folder: "goighem/products", resource_type: "image" }
                        : { folder: "goighem/music", resource_type: "raw" },
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

