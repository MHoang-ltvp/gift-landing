"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { Product, Occasion } from "@/types";
import { SUB_CATEGORIES_BY_OCCASION } from "@/types";

interface ProductEditModalProps {
    product: Product;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProductEditModal({ product, onClose, onSuccess }: ProductEditModalProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(product.image || null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [imageSource, setImageSource] = useState<"file" | "url">(product.image ? "url" : "file");
    const [imageRemoved, setImageRemoved] = useState(false);
    const [title, setTitle] = useState(product.title || "");
    const [price, setPrice] = useState(product.price?.toString() || "");
    const [description, setDescription] = useState(product.description || "");
    const [occasion, setOccasion] = useState<Occasion>(product.occasion || "tet");
    const [subCategory, setSubCategory] = useState(product.subCategory || "");
    const [active, setActive] = useState(product.active ?? true);

    const validSubCategories = useMemo(() => SUB_CATEGORIES_BY_OCCASION[occasion].map((o) => o.value), [occasion]);
    useEffect(() => {
        if (subCategory && !validSubCategories.includes(subCategory)) {
            setSubCategory("");
        }
    }, [occasion, validSubCategories, subCategory]);

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
            if (!file.type.startsWith("image/")) {
                setMessage({ type: "error", text: "Vui lòng chọn file ảnh" });
                return;
            }
            if (file.size > 15 * 1024 * 1024) {
                setMessage({ type: "error", text: "Kích thước ảnh không được vượt quá 5MB" });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!subCategory.trim()) {
            setMessage({ type: "error", text: "Vui lòng chọn BST (Bộ sưu tập)" });
            setLoading(false);
            return;
        }

        try {
            let imageUrl: string | null = product.image || null;

            if (imageRemoved) {
                // Nếu đã xóa ảnh, set null
                imageUrl = null;
            } else if (imageSource === "file") {
                const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
                const imageFile = fileInput?.files?.[0];
                if (imageFile && imageFile.size > 0) {
                    setUploading(true);
                    const uploadFormData = new FormData();
                    uploadFormData.append("file", imageFile);

                    const uploadRes = await fetch("/api/admin/upload", {
                        method: "POST",
                        credentials: "include",
                        body: uploadFormData,
                    });

                    const uploadData = await uploadRes.json();

                    if (!uploadRes.ok) {
                        throw new Error(uploadData.error || "Upload ảnh thất bại");
                    }

                    imageUrl = uploadData.url;
                    setUploading(false);
                }
            } else if (imageSource === "url") {
                const urlInput = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
                const imageUrlInput = urlInput?.value.trim() || "";
                if (imageUrlInput) {
                    if (!imageUrlInput.startsWith("http://") && !imageUrlInput.startsWith("https://")) {
                        setMessage({ type: "error", text: "URL ảnh phải bắt đầu bằng http:// hoặc https://" });
                        setLoading(false);
                        return;
                    }
                    imageUrl = imageUrlInput;
                } else if (!imageUrlInput && product.image) {
                    // Nếu xóa URL và product có ảnh cũ, giữ nguyên (không xóa)
                    imageUrl = product.image;
                }
            }

            let parsedPrice: number | undefined;
            if (price) {
                const cleanPrice = price.replace(/[,.\s]/g, "");
                const numPrice = parseFloat(cleanPrice);
                if (!isNaN(numPrice) && numPrice > 0) {
                    parsedPrice = numPrice;
                }
            }

            const productData: any = {
                title: title.trim(),
                price: parsedPrice,
                description: description.trim() || undefined,
                occasion,
                subCategory: subCategory.trim(),
                active,
            };

            // Chỉ gửi image nếu có thay đổi
            if (imageRemoved) {
                productData.image = null;
            } else if (imageUrl) {
                productData.image = imageUrl;
            }

            const res = await fetch(`/api/admin/products/${product._id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Cập nhật sản phẩm thất bại");
            }

            setMessage({ type: "success", text: "✅ Cập nhật sản phẩm thành công!" });
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } catch (error) {
            console.error("Error updating product:", error);
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
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                    width: "100%",
                    maxWidth: "600px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#6B7280",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        transition: "all 0.2s",
                        zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#F3F4F6";
                        e.currentTarget.style.color = "#1F2937";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#6B7280";
                    }}
                >
                    ×
                </button>

                <div style={{ padding: "32px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#1F2937", marginBottom: "24px" }}>
                        Chỉnh Sửa Sản phẩm
                    </h2>

                    <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Tên sản phẩm */}
                        <div>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                                Tên sản phẩm *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    inputMode="numeric"
                                    placeholder="Nhập giá sản phẩm"
                                    style={{
                                        width: "100%",
                                        padding: 12,
                                        border: "1px solid #ddd",
                                        borderRadius: 6,
                                        fontSize: 14,
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                                    Tag (Dịp) *
                                </label>
                                <select
                                    value={occasion}
                                    onChange={(e) => setOccasion(e.target.value as "tet" | "valentine" | "8-3")}
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

                        <div>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                                BST (Bộ sưu tập) *
                            </label>
                            <select
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    border: "1px solid #ddd",
                                    borderRadius: 6,
                                    fontSize: 14,
                                }}
                            >
                                <option value="">Chọn BST</option>
                                {SUB_CATEGORIES_BY_OCCASION[occasion].map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <p style={{ marginTop: 4, fontSize: 12, color: "#666" }}>
                                Chọn Tag (Dịp) trước, sau đó chọn BST (Mã Đáo, Kim Lộc, … theo dịp).
                            </p>
                        </div>

                        {/* Mô tả */}
                        <div>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                                Mô tả sản phẩm
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                        borderBottom: imageSource === "file" ? "2px solid #d32f2f" : "2px solid transparent",
                                        backgroundColor: "transparent",
                                        color: imageSource === "file" ? "#d32f2f" : "#666",
                                        fontWeight: imageSource === "file" ? 600 : 400,
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
                                </>
                            )}

                            {imageSource === "url" && (
                                <>
                                    <input
                                        name="imageUrl"
                                        type="url"
                                        defaultValue={product.image || ""}
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
                                </>
                            )}

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
                                            setImageRemoved(true);
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

                        {/* Active Status */}
                        <div>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                    style={{ width: 18, height: 18, cursor: "pointer" }}
                                />
                                <span style={{ fontWeight: 500 }}>Sản phẩm đang hoạt động</span>
                            </label>
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
                                }}
                            >
                                {message.text}
                            </div>
                        )}

                        {/* Submit button */}
                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                style={{
                                    flex: 1,
                                    padding: "12px 24px",
                                    backgroundColor: loading || uploading ? "#ccc" : "#7C3AED",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 6,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    cursor: loading || uploading ? "not-allowed" : "pointer",
                                }}
                            >
                                {uploading ? "Đang upload ảnh..." : loading ? "Đang cập nhật..." : "💾 Lưu Thay Đổi"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    padding: "12px 24px",
                                    backgroundColor: "#F3F4F6",
                                    color: "#6B7280",
                                    border: "none",
                                    borderRadius: 6,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

