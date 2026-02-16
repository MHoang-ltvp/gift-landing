"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { theme } from "@/lib/theme";

interface ProductCardProps {
    product: Product;
    priority?: boolean;
    variant?: "default" | "block";
    /** Click vào thẻ → mở popup chi tiết sản phẩm */
    onClick?: (product: Product) => void;
}

export default function ProductCard({ product, priority = false, variant = "default", onClick }: ProductCardProps) {
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
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
                onClick={() => onClick?.(product)}
                onKeyDown={(e) => {
                    if (onClick && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onClick(product);
                    }
                }}
                style={{
                    backgroundColor: theme.colors.bgWhite,
                    borderRadius: theme.borderRadius.xl,
                    overflow: "hidden",
                    border: `1px solid ${theme.colors.borderLight}`,
                    transition: theme.transitions.slow,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    minHeight: 0,
                    boxShadow: theme.shadows.md,
                    cursor: onClick ? "pointer" : undefined,
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
                {/* Khung ảnh vuông, cùng kích thước cho mọi thẻ */}
                <div
                    className="product-image"
                    style={{
                        width: "100%",
                        aspectRatio: "1",
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

                    {/* Price và Button Xem chi tiết */}
                    {product.price && (
                        <div
                            style={{
                                marginTop: theme.spacing.xs,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: theme.spacing.sm,
                                flexWrap: "wrap",
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
                            {onClick && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Ngăn trigger onClick của card
                                        onClick(product);
                                    }}
                                    style={{
                                        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                        backgroundColor: theme.colors.primary,
                                        color: theme.colors.textWhite,
                                        border: "none",
                                        borderRadius: theme.borderRadius.md,
                                        fontSize: "clamp(12px, 1.2vw, 14px)",
                                        fontWeight: theme.typography.fontWeight.medium,
                                        fontFamily: theme.typography.fontFamily.body,
                                        cursor: "pointer",
                                        transition: theme.transitions.normal,
                                        whiteSpace: "nowrap",
                                        boxShadow: theme.shadows.sm,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = theme.shadows.md;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.colors.primary;
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = theme.shadows.sm;
                                    }}
                                >
                                    Xem chi tiết
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
