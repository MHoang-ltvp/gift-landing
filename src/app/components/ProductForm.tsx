"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
    onSuccess?: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [imageSource, setImageSource] = useState<"file" | "url">("file");

    // Tự động ẩn thông báo thành công sau 3 giây
    useEffect(() => {
        if (message?.type === "success") {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setMessage({ type: "error", text: "Vui lòng chọn file ảnh" });
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: "error", text: "Kích thước ảnh không được vượt quá 5MB" });
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Lưu tham chiếu form trước khi async để tránh lỗi null
        const form = e.currentTarget;

        try {
            const formData = new FormData(form);
            const title = formData.get("title")?.toString().trim() || "";
            const price = formData.get("price")?.toString().trim() || "";
            const description = formData.get("description")?.toString().trim() || "";
            const occasion = formData.get("occasion")?.toString() || "tet";
            const imageFile = formData.get("image") as File | null;
            const imageUrlInput = formData.get("imageUrl")?.toString().trim() || "";

            if (!title) {
                setMessage({ type: "error", text: "Vui lòng nhập tên sản phẩm" });
                setLoading(false);
                return;
            }

            let imageUrl = "";

            // Handle image: either upload file or use URL
            if (imageSource === "file" && imageFile && imageFile.size > 0) {
                // Upload file to Cloudinary
                setUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append("file", imageFile);

                const uploadRes = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                const uploadData = await uploadRes.json();

                if (!uploadRes.ok) {
                    throw new Error(uploadData.error || "Upload ảnh thất bại");
                }

                imageUrl = uploadData.url;
                setUploading(false);
            } else if (imageSource === "url" && imageUrlInput) {
                // Validate URL
                if (!imageUrlInput.startsWith("http://") && !imageUrlInput.startsWith("https://")) {
                    setMessage({ type: "error", text: "URL ảnh phải bắt đầu bằng http:// hoặc https://" });
                    setLoading(false);
                    return;
                }
                imageUrl = imageUrlInput;
            }

            // Parse price - cho phép nhập số tự do
            let parsedPrice: number | undefined;
            if (price) {
                // Loại bỏ dấu phẩy, khoảng trắng và chuyển đổi
                const cleanPrice = price.replace(/[,.\s]/g, "");
                const numPrice = parseFloat(cleanPrice);
                if (!isNaN(numPrice) && numPrice > 0) {
                    parsedPrice = numPrice;
                }
            }

            // Create product
            const productData = {
                title,
                price: parsedPrice,
                description: description || undefined,
                image: imageUrl || undefined,
                occasion,
                active: true,
            };

            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Tạo sản phẩm thất bại");
            }

            // Reset form ngay lập tức khi thành công
            form.reset();
            setPreview(null);

            // Hiển thị thông báo thành công
            setMessage({ type: "success", text: "✅ Tạo sản phẩm thành công!" });

            // Call onSuccess callback if provided (for modal)
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            } else {
                // Refresh page sau 2 giây để hiển thị sản phẩm mới (for non-modal usage)
                setTimeout(() => {
                    router.refresh();
                }, 2000);
            }
        } catch (error) {
            console.error("Error creating product:", error);
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại.",
            });
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `
            }} />
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Tên sản phẩm */}
            <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                    Tên sản phẩm *
                </label>
                <input
                    name="title"
                    type="text"
                    required
                    placeholder="Nhập tên sản phẩm"
                    style={{
                        width: "100%",
                        padding: 12,
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        fontSize: 14,
                    }}
                />
            </div>

            {/* Giá và Tag */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                        Giá (VNĐ)
                    </label>
                    <input
                        name="price"
                        type="text"
                        inputMode="numeric"
                        placeholder="Nhập giá sản phẩm (ví dụ: 100000 hoặc 100,000)"
                        style={{
                            width: "100%",
                            padding: 12,
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            fontSize: 14,
                        }}
                    />
                    <p style={{ marginTop: 4, fontSize: 12, color: "#666" }}>
                        Có thể nhập số tự do, ví dụ: 100000, 100.000, 100,000
                    </p>
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                        Tag (Dịp) *
                    </label>
                    <select
                        name="occasion"
                        required
                        style={{
                            width: "100%",
                            padding: 12,
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            fontSize: 14,
                        }}
                    >
                        <option value="tet">Tết</option>
                        <option value="valentine">Valentine</option>
                        <option value="8-3">8/3</option>
                    </select>
                </div>
            </div>

            {/* Mô tả */}
            <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                    Mô tả sản phẩm
                </label>
                <textarea
                    name="description"
                    rows={4}
                    placeholder="Nhập mô tả sản phẩm"
                    style={{
                        width: "100%",
                        padding: 12,
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        fontSize: 14,
                        fontFamily: "inherit",
                        resize: "vertical",
                    }}
                />
            </div>

            {/* Upload ảnh */}
            <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                    Ảnh sản phẩm
                </label>
                
                {/* Tabs: Upload file hoặc URL */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12, borderBottom: "1px solid #e0e0e0" }}>
                    <button
                        type="button"
                        onClick={() => {
                            setImageSource("file");
                            setPreview(null);
                            const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
                            const urlInput = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                            if (urlInput) urlInput.value = "";
                        }}
                        style={{
                            padding: "8px 16px",
                            border: "none",
                            borderBottom: "2px solid #d32f2f",
                            backgroundColor: "transparent",
                            color: "#d32f2f",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: 14,
                        }}
                    >
                        📁 Upload File
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setImageSource("url");
                            setPreview(null);
                            const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
                            const urlInput = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                            if (urlInput) urlInput.value = "";
                        }}
                        style={{
                            padding: "8px 16px",
                            border: "none",
                            borderBottom: imageSource === "url" ? "2px solid #d32f2f" : "2px solid transparent",
                            backgroundColor: "transparent",
                            color: imageSource === "url" ? "#d32f2f" : "#666",
                            fontWeight: imageSource === "url" ? 600 : 400,
                            cursor: "pointer",
                            fontSize: 14,
                        }}
                    >
                        🔗 URL Ảnh
                    </button>
                </div>

                {/* File Upload */}
                {imageSource === "file" && (
                    <>
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                                width: "100%",
                                padding: 12,
                                border: "1px solid #ddd",
                                borderRadius: 6,
                                fontSize: 14,
                            }}
                        />
                        <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                            Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF
                        </p>
                    </>
                )}

                {/* URL Input */}
                {imageSource === "url" && (
                    <>
                        <input
                            name="imageUrl"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            onChange={(e) => {
                                const url = e.target.value.trim();
                                if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
                                    setPreview(url);
                                } else if (!url) {
                                    setPreview(null);
                                }
                            }}
                            style={{
                                width: "100%",
                                padding: 12,
                                border: "1px solid #ddd",
                                borderRadius: 6,
                                fontSize: 14,
                            }}
                        />
                        <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                            Nhập URL ảnh từ internet (phải bắt đầu bằng http:// hoặc https://)
                        </p>
                    </>
                )}

                {/* Preview */}
                {preview && (
                    <div style={{ marginTop: 12, position: "relative", display: "inline-block" }}>
                        <img
                            src={preview}
                            alt="Preview"
                            onError={() => {
                                setPreview(null);
                                setMessage({ type: "error", text: "Không thể tải ảnh từ URL này" });
                            }}
                            style={{
                                maxWidth: "100%",
                                maxHeight: 300,
                                borderRadius: 6,
                                border: "1px solid #ddd",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setPreview(null);
                                const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
                                const urlInput = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
                                if (fileInput) fileInput.value = "";
                                if (urlInput) urlInput.value = "";
                            }}
                            style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                backgroundColor: "#EF4444",
                                color: "#ffffff",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            }}
                            title="Xóa ảnh"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>

            {/* Message */}
            {message && (
                <div
                    style={{
                        padding: "14px 16px",
                        borderRadius: 6,
                        backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                        color: message.type === "success" ? "#155724" : "#721c24",
                        border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                        fontSize: 14,
                        fontWeight: message.type === "success" ? 500 : 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        animation: "fadeIn 0.3s ease-in",
                    }}
                >
                    <span style={{ flex: 1 }}>{message.text}</span>
                    <button
                        type="button"
                        onClick={() => setMessage(null)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: message.type === "success" ? "#155724" : "#721c24",
                            cursor: "pointer",
                            fontSize: 20,
                            lineHeight: 1,
                            padding: 0,
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = message.type === "success"
                                ? "rgba(21, 87, 36, 0.1)"
                                : "rgba(114, 28, 36, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        aria-label="Đóng thông báo"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Submit button */}
            <button
                type="submit"
                disabled={loading || uploading}
                style={{
                    padding: "12px 24px",
                    backgroundColor: loading || uploading ? "#ccc" : "#d32f2f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: loading || uploading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                }}
            >
                {uploading ? "Đang upload ảnh..." : loading ? "Đang tạo..." : "Tạo sản phẩm"}
            </button>
        </form>
        </>
    );
}

