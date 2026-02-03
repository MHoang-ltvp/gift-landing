"use client";

import type { Product } from "@/types";
import { theme } from "@/lib/theme";
import { SUB_CATEGORIES_BY_OCCASION } from "@/types";
import type { Occasion } from "@/types";

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
}

const occasionLabels: Record<Occasion, string> = {
    tet: "Tết",
    valentine: "Valentine",
    "8-3": "8/3",
};

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
    const imageUrl =
        product.image ||
        `https://via.placeholder.com/500x500/${theme.colors.primary.replace("#", "")}/ffffff?text=${encodeURIComponent(product.title)}`;
    const bstLabel = product.subCategory
        ? SUB_CATEGORIES_BY_OCCASION[product.occasion]?.find((s) => s.value === product.subCategory)?.label
        : null;

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes modalFadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes modalSlideIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .product-modal-overlay {
                        animation: modalFadeIn 0.2s ease-out;
                    }
                    .product-modal-box {
                        animation: modalSlideIn 0.25s ease-out;
                    }
                `
            }} />
            <div
                className="product-modal-overlay"
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: theme.spacing.lg,
                }}
                onClick={onClose}
            >
                <div
                    className="product-modal-box"
                    style={{
                        backgroundColor: theme.colors.bgWhite,
                        borderRadius: theme.borderRadius.xl,
                        overflow: "hidden",
                        maxWidth: 720,
                        width: "100%",
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "row",
                        boxShadow: theme.shadows.xl,
                        position: "relative",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            @media (max-width: 600px) {
                                .product-modal-box {
                                    flex-direction: column !important;
                                    max-height: 85vh !important;
                                }
                                .product-modal-box > div:first-of-type {
                                    width: 100% !important;
                                    aspect-ratio: 1 !important;
                                    max-height: 50vh !important;
                                }
                            }
                        `
                    }} />
                    {/* Nút đóng */}
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: theme.spacing.md,
                            right: theme.spacing.md,
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(0,0,0,0.06)",
                            color: theme.colors.textPrimary,
                            fontSize: 20,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            transition: theme.transitions.normal,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(0,0,0,0.12)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(0,0,0,0.06)";
                        }}
                    >
                        ×
                    </button>

                    {/* Bên trái: ảnh sản phẩm */}
                    <div
                        style={{
                            width: "min(320px, 45%)",
                            flexShrink: 0,
                            aspectRatio: "1",
                            background: theme.colors.bgPrimary,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={imageUrl}
                            alt={product.title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>

                    {/* Bên phải: thông tin sản phẩm */}
                    <div
                        style={{
                            flex: 1,
                            padding: theme.spacing.xl,
                            paddingTop: theme.spacing.xxl,
                            display: "flex",
                            flexDirection: "column",
                            gap: theme.spacing.md,
                            minWidth: 0,
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "clamp(20px, 2.5vw, 26px)",
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.textPrimary,
                                fontFamily: theme.typography.fontFamily.display,
                                lineHeight: 1.3,
                            }}
                        >
                            {product.title}
                        </h2>

                        {product.price != null && (
                            <div>
                                <span
                                    style={{
                                        fontSize: "clamp(22px, 3vw, 28px)",
                                        fontWeight: theme.typography.fontWeight.bold,
                                        color: theme.colors.primary,
                                        fontFamily: theme.typography.fontFamily.body,
                                    }}
                                >
                                    {product.price.toLocaleString("vi-VN")}₫
                                </span>
                            </div>
                        )}

                        {product.description && (
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: theme.typography.fontSize.md,
                                    color: theme.colors.textSecondary,
                                    lineHeight: 1.7,
                                    fontFamily: theme.typography.fontFamily.body,
                                    flex: 1,
                                    overflowY: "auto",
                                }}
                            >
                                {product.description}
                            </p>
                        )}

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: theme.spacing.sm,
                                marginTop: theme.spacing.sm,
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                    borderRadius: theme.borderRadius.md,
                                    backgroundColor: theme.colors.bgPrimary,
                                    color: theme.colors.primary,
                                    fontSize: theme.typography.fontSize.sm,
                                    fontWeight: theme.typography.fontWeight.medium,
                                }}
                            >
                                {occasionLabels[product.occasion]}
                            </span>
                            {bstLabel && (
                                <span
                                    style={{
                                        display: "inline-block",
                                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                        borderRadius: theme.borderRadius.md,
                                        backgroundColor: theme.colors.bgSecondary,
                                        color: theme.colors.textPrimary,
                                        fontSize: theme.typography.fontSize.sm,
                                    }}
                                >
                                    BST: {bstLabel}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
