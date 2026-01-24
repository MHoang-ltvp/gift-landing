"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { theme } from "@/lib/theme";

interface ProductCardProps {
    product: Product;
    priority?: boolean; // Ưu tiên load ảnh đầu tiên
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);
    const imageUrl = product.image || `https://via.placeholder.com/400x400/${theme.colors.primary.replace("#", "")}/ffffff?text=${encodeURIComponent(product.title)}`;

    // Background gradient pastel cho image area (random hoặc dựa trên occasion)
    const pastelGradients = [
        `linear-gradient(to bottom right, ${theme.colors.bgPrimary}, ${theme.colors.bgSecondary})`,
        `linear-gradient(to bottom right, #fff5f5, #ffe5e5)`,
        `linear-gradient(to bottom right, #fff8e1, #ffe0b2)`,
        `linear-gradient(to bottom right, #fce4ec, #f8bbd0)`,
    ];
    const gradientIndex = (product._id?.charCodeAt(0) || 0) % pastelGradients.length;
    const imageBackground = pastelGradients[gradientIndex];

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes imageZoom {
                        from {
                            transform: scale(1);
                        }
                        to {
                            transform: scale(1.1);
                        }
                    }
                    .product-card:hover .product-image img {
                        animation: imageZoom 0.5s ease-out forwards;
                    }
                    .product-card:not(:hover) .product-image img {
                        animation: none;
                        transform: scale(1);
                    }
                `
            }} />
            <div
                className="product-card"
                style={{
                    backgroundColor: theme.colors.bgWhite,
                    borderRadius: theme.borderRadius.xl,
                    overflow: "hidden",
                    border: `1px solid ${theme.colors.borderLight}`,
                    transition: theme.transitions.slow,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    boxShadow: theme.shadows.md,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                    e.currentTarget.style.boxShadow = theme.shadows.xl;
                    e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                    e.currentTarget.style.borderColor = theme.colors.borderLight;
                }}
            >
                {/* Product Image - Với background pastel gradient */}
                {/* 
                ═══════════════════════════════════════════════════════════
                KHUYẾN NGHỊ KÍCH THƯỚC ẢNH ĐỂ UPLOAD:
                ═══════════════════════════════════════════════════════════
                
                📐 KÍCH THƯỚC KHUNG HIỂN THỊ:
                - Trang người dùng: 280px (width) × 192px (height) - Tỷ lệ 1.46:1 (chữ nhật ngang)
                - Trang admin: 150px × 150px - Tỷ lệ 1:1 (vuông)
                
                🎯 KÍCH THƯỚC ẢNH TỐI ƯU:
                ✅ TỐT NHẤT: 500×500px (vuông)
                   - Hiển thị đẹp trên cả 2 trang
                   - Không bị crop nhiều
                   - Nét trên màn hình Retina
                
                ✅ TỐT: 400×400px (vuông)
                   - Nhẹ hơn, load nhanh hơn
                   - Vẫn hiển thị đẹp
                
                ⚠️ CÓ THỂ DÙNG: 600×400px (tỷ lệ 1.5:1)
                   - Khớp với tỷ lệ khung trang người dùng
                   - Nhưng sẽ bị crop ở trang admin
                
                📋 THÔNG SỐ KỸ THUẬT:
                - Format: JPG (cho ảnh thật), PNG (cho ảnh có nền trong suốt), WebP (tối ưu nhất)
                - Kích thước file: < 300KB (khuyến nghị < 200KB)
                - Độ phân giải: 72-96 DPI (đủ cho web)
                - Color space: sRGB
                
                💡 LƯU Ý:
                - Ảnh vuông (500×500px) là lựa chọn tốt nhất vì:
                  + Hiển thị đẹp trên cả trang admin (vuông) và trang người dùng (chữ nhật)
                  + objectFit: "cover" sẽ tự động crop đều các cạnh
                  + Dễ chỉnh sửa và upload
                ═══════════════════════════════════════════════════════════
            */}
                <div
                    className="product-image"
                    style={{
                        width: "100%",
                        height: 192,
                        position: "relative",
                        background: imageBackground,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {!imageError ? (
                        <img
                            src={imageUrl}
                            alt={product.title}
                            onError={() => {
                                setImageError(true);
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                            loading={priority ? "eager" : "lazy"}
                            decoding="async"
                        />
                    ) : (
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            color: theme.colors.textTertiary,
                            fontSize: theme.typography.fontSize.sm,
                            fontFamily: theme.typography.fontFamily.body,
                            padding: theme.spacing.sm,
                            textAlign: "center",
                        }}>
                            <div style={{ marginBottom: theme.spacing.xs, fontSize: theme.typography.fontSize.xl }}>📷</div>
                            <div>Không thể tải ảnh</div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div
                    style={{
                        padding: theme.spacing.md,
                        display: "flex",
                        flexDirection: "column",
                        gap: theme.spacing.sm,
                    }}
                >
                    {/* Tên sản phẩm */}
                    <h3
                        style={{
                            margin: 0,
                            fontSize: "clamp(16px, 1.5vw, 18px)",
                            fontWeight: theme.typography.fontWeight.semibold,
                            color: theme.colors.textPrimary,
                            lineHeight: 1.4,
                            fontFamily: theme.typography.fontFamily.body,
                        }}
                    >
                        {product.title}
                    </h3>

                    {/* Mô tả sản phẩm */}
                    {product.description && (
                        <p
                            style={{
                                margin: 0,
                                fontSize: "clamp(13px, 1.2vw, 15px)",
                                color: theme.colors.textSecondary,
                                lineHeight: 1.6,
                                fontFamily: theme.typography.fontFamily.body,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {product.description}
                        </p>
                    )}

                    {/* Price */}
                    {product.price && (
                        <div
                            style={{
                                marginTop: theme.spacing.xs,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "clamp(18px, 2vw, 22px)",
                                    fontWeight: theme.typography.fontWeight.bold,
                                    color: theme.colors.primary,
                                    fontFamily: theme.typography.fontFamily.body,
                                }}
                            >
                                {product.price.toLocaleString("vi-VN")}₫
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
