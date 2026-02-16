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

interface ScrollableProductRowProps {
    products: Product[];
    isVisible: boolean;
    onProductClick: (product: Product) => void;
}

function ScrollableProductRow({ products, isVisible, onProductClick }: ScrollableProductRowProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    const checkScrollButtons = () => {
        if (!scrollContainerRef.current) return;
        
        const container = scrollContainerRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = container;
        
        // Kiểm tra nếu có thể scroll (nội dung vượt quá container)
        const canScroll = scrollWidth > clientWidth;
        
        // Hiển thị nút trái nếu đã scroll sang phải
        setShowLeftButton(canScroll && scrollLeft > 10);
        
        // Hiển thị nút phải nếu chưa scroll hết
        setShowRightButton(canScroll && scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        checkScrollButtons();
        
        const container = scrollContainerRef.current;
        if (!container) return;

        // Kiểm tra lại khi resize
        const handleResize = () => {
            // Delay nhỏ để đảm bảo layout đã cập nhật
            setTimeout(checkScrollButtons, 100);
        };

        // Kiểm tra lại khi scroll
        container.addEventListener("scroll", checkScrollButtons);
        window.addEventListener("resize", handleResize);

        // Kiểm tra lại sau khi component mount và khi products thay đổi
        const timeoutId = setTimeout(checkScrollButtons, 300);

        return () => {
            container.removeEventListener("scroll", checkScrollButtons);
            window.removeEventListener("resize", handleResize);
            clearTimeout(timeoutId);
        };
    }, [products]);

    const scroll = (direction: "left" | "right") => {
        if (!scrollContainerRef.current) return;
        
        const container = scrollContainerRef.current;
        const cardWidth = 280; // width của mỗi card
        const gap = parseInt(theme.spacing.lg); // gap giữa các card
        const scrollAmount = cardWidth + gap;
        
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div style={{ position: "relative", width: "100%" }}>
            {/* Nút trái */}
            {showLeftButton && (
                <button
                    onClick={() => scroll("left")}
                    style={{
                        position: "absolute",
                        left: "-24px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: "48px",
                        height: "48px",
                        borderRadius: theme.borderRadius.full,
                        backgroundColor: theme.colors.bgWhite,
                        border: `2px solid ${theme.colors.primary}`,
                        color: theme.colors.primary,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        fontWeight: theme.typography.fontWeight.bold,
                        boxShadow: theme.shadows.md,
                        transition: theme.transitions.normal,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primary;
                        e.currentTarget.style.color = theme.colors.textWhite;
                        e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.bgWhite;
                        e.currentTarget.style.color = theme.colors.primary;
                        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                    }}
                    aria-label="Cuộn sang trái"
                >
                    ‹
                </button>
            )}

            {/* Container sản phẩm */}
            <div
                ref={scrollContainerRef}
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
                {products.map((product, index) => (
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
                            onClick={onProductClick}
                        />
                    </div>
                ))}
            </div>

            {/* Nút phải */}
            {showRightButton && (
                <button
                    onClick={() => scroll("right")}
                    style={{
                        position: "absolute",
                        right: "-24px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: "48px",
                        height: "48px",
                        borderRadius: theme.borderRadius.full,
                        backgroundColor: theme.colors.bgWhite,
                        border: `2px solid ${theme.colors.primary}`,
                        color: theme.colors.primary,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        fontWeight: theme.typography.fontWeight.bold,
                        boxShadow: theme.shadows.md,
                        transition: theme.transitions.normal,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primary;
                        e.currentTarget.style.color = theme.colors.textWhite;
                        e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.bgWhite;
                        e.currentTarget.style.color = theme.colors.primary;
                        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                    }}
                    aria-label="Cuộn sang phải"
                >
                    ›
                </button>
            )}
        </div>
    );
}

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
                                    <ScrollableProductRow
                                        products={blockProducts}
                                        isVisible={isVisible}
                                        onProductClick={(p) => setSelectedProduct(p)}
                                    />
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
