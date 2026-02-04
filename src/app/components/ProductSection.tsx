"use client";

import { useRef, useEffect, useState } from "react";
import type { Product, Occasion } from "@/types";
import { SUB_CATEGORIES_BY_OCCASION } from "@/types";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import { theme } from "@/lib/theme";

interface ProductSectionProps {
    occasion: Occasion;
    products: Product[];
    label: string;
}

const occasionConfig: Record<Occasion, { tagline: string }> = {
    tet: {
        tagline: "Đón Tết sum vầy với những bộ quà sang trọng",
    },
    valentine: {
        tagline: "Trao yêu thương đến người đặc biệt",
    },
    "8-3": {
        tagline: "Tri ân phái đẹp với những bộ quà tinh tế",
    },
};

export default function ProductSection({ occasion, products, label }: ProductSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const config = occasionConfig[occasion];
    const subCategories = SUB_CATEGORIES_BY_OCCASION[occasion];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(50px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slideInLeft {
                        from { opacity: 0; transform: translateX(-30px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes cardSlideIn {
                        from { opacity: 0; transform: translateY(30px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .section-fade-in { animation: fadeInUp 0.8s ease-out forwards; }
                    .title-slide-in { animation: slideInLeft 0.8s ease-out forwards; }
                    .card-animate { animation: cardSlideIn 0.6s ease-out forwards; opacity: 0; }
                    .category-row::-webkit-scrollbar { display: none; }
                `
            }} />
            <section
                ref={sectionRef}
                id={occasion}
                style={{
                    padding: `${theme.spacing.xxxl} ${theme.spacing.lg}`,
                    scrollMarginTop: 80,
                    backgroundColor: theme.colors.bgWhite,
                }}
                className={isVisible ? "section-fade-in" : ""}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Header: Danh mục Tết + tagline / ... */}
                    <div style={{ marginBottom: theme.spacing.xxl }}>
                        <h2
                            className={isVisible ? "title-slide-in" : ""}
                            style={{
                                margin: 0,
                                marginBottom: theme.spacing.xs,
                                fontSize: "clamp(36px, 5vw, 56px)",
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.textPrimary,
                                fontFamily: theme.typography.fontFamily.display,
                            }}
                        >
                            {label}
                        </h2>
                        <p
                            className={isVisible ? "title-slide-in" : ""}
                            style={{
                                margin: 0,
                                fontSize: "clamp(16px, 2vw, 20px)",
                                color: theme.colors.textSecondary,
                                fontFamily: theme.typography.fontFamily.body,
                                animationDelay: "0.1s",
                            }}
                        >
                            {config.tagline}
                        </p>
                    </div>

                    {/* Dưới Danh mục Tết: lần lượt Mã Đáo (sản phẩm Mã Đáo) → Kim Lộc (sản phẩm Kim Lộc) → Khởi Vận → An Khang. Tương tự cho Valentine và 8/3. */}
                    {subCategories.map((sub, blockIndex) => {
                        const blockProducts = products.filter((p) => (p.subCategory || "") === sub.value);

                        return (
                            <div
                                key={sub.value}
                                className={isVisible ? "title-slide-in" : ""}
                                style={{
                                    marginBottom: theme.spacing.xxl,
                                    animationDelay: `${0.15 + blockIndex * 0.05}s`,
                                }}
                            >
                                {/* Tên nhóm: Mã Đáo, Kim Lộc, ... — căn giữa, có line trang trí */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: theme.spacing.lg,
                                        marginBottom: theme.spacing.lg,
                                    }}
                                >
                                    <span
                                        style={{
                                            flex: "1 1 0",
                                            minWidth: 32,
                                            height: 2,
                                            borderRadius: 1,
                                            background: `linear-gradient(90deg, transparent 0%, ${theme.colors.borderLight} 30%, ${theme.colors.primary} 70%, transparent 100%)`,
                                            maxWidth: 140,
                                        }}
                                    />
                                    <h3
                                        style={{
                                            margin: 0,
                                            padding: `0 ${theme.spacing.lg}`,
                                            fontSize: "clamp(18px, 2.2vw, 26px)",
                                            fontWeight: theme.typography.fontWeight.semibold,
                                            color: theme.colors.textPrimary,
                                            fontFamily: theme.typography.fontFamily.display,
                                            letterSpacing: "0.04em",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {sub.label}
                                    </h3>
                                    <span
                                        style={{
                                            flex: "1 1 0",
                                            minWidth: 32,
                                            height: 2,
                                            borderRadius: 1,
                                            background: `linear-gradient(90deg, transparent 0%, ${theme.colors.primary} 30%, ${theme.colors.borderLight} 70%, transparent 100%)`,
                                            maxWidth: 140,
                                        }}
                                    />
                                </div>
                                {/* Hàng sản phẩm của nhóm này; nếu không có thì hiển thị thông báo */}
                                {blockProducts.length === 0 ? (
                                    <div
                                        style={{
                                            padding: theme.spacing.xl,
                                            textAlign: "center",
                                            color: theme.colors.textTertiary,
                                            fontSize: theme.typography.fontSize.sm,
                                            backgroundColor: theme.colors.bgGray,
                                            borderRadius: theme.borderRadius.lg,
                                            border: `1px dashed ${theme.colors.borderMedium}`,
                                        }}
                                    >
                                        Chưa có sản phẩm trong nhóm {sub.label}
                                    </div>
                                ) : (
                                    <div
                                        className="category-row"
                                        style={{
                                            display: "flex",
                                            gap: theme.spacing.lg,
                                            overflowX: "auto",
                                            overflowY: "hidden",
                                            scrollBehavior: "smooth",
                                            scrollbarWidth: "none",
                                            msOverflowStyle: "none",
                                            paddingBottom: theme.spacing.md,
                                        }}
                                    >
                                        {blockProducts.map((product, index) => (
                                            <div
                                                key={product._id}
                                                className={isVisible ? "card-animate" : ""}
                                                style={{
                                                    flex: "0 0 280px",
                                                    width: 280,
                                                    minWidth: 280,
                                                    animationDelay: `${0.2 + index * 0.08}s`,
                                                }}
                                            >
                                                <ProductCard
                                                    product={product}
                                                    variant="block"
                                                    priority={index < 3}
                                                    onClick={(p) => setSelectedProduct(p)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Khi không có sản phẩm nào trong danh mục */}
                    {products.length === 0 && (
                        <div
                            style={{
                                padding: theme.spacing.xxxl,
                                textAlign: "center",
                                color: theme.colors.textTertiary,
                                fontSize: theme.typography.fontSize.md,
                                backgroundColor: theme.colors.bgGray,
                                borderRadius: theme.borderRadius.lg,
                                border: `2px dashed ${theme.colors.borderMedium}`,
                            }}
                        >
                            Chưa có sản phẩm nào trong danh mục này
                        </div>
                    )}
                </div>
            </section>

            {/* Popup chi tiết sản phẩm: ảnh trái, thông tin phải */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}
