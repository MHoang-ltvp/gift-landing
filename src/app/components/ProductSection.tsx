"use client";

import { useRef, useEffect, useState } from "react";
import type { Product, Occasion } from "@/types";
import ProductCard from "./ProductCard";
import { theme } from "@/lib/theme";

interface ProductSectionProps {
    occasion: Occasion;
    products: Product[];
    label: string;
}

// Tagline cho từng occasion
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
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const config = occasionConfig[occasion];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const scrollCarousel = (direction: number) => {
        if (carouselRef.current) {
            const scrollAmount = carouselRef.current.children[0]?.clientWidth || 300;
            carouselRef.current.scrollBy({
                left: direction * scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes slideInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    @keyframes cardSlideIn {
                        from {
                            opacity: 0;
                            transform: translateY(30px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    .section-fade-in {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                    .title-slide-in {
                        animation: slideInLeft 0.8s ease-out forwards;
                    }
                    .card-animate {
                        animation: cardSlideIn 0.6s ease-out forwards;
                        opacity: 0;
                    }
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
                <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
                    {/* Section Header */}
                    <div style={{ marginBottom: theme.spacing.xl }}>
                        <div style={{ marginBottom: theme.spacing.sm }}>
                            {/* Title */}
                            <h2
                                className={isVisible ? "title-slide-in" : ""}
                                style={{
                                    margin: 0,
                                    marginLeft: 0,
                                    marginBottom: theme.spacing.xs,
                                    paddingLeft: 0,
                                    fontSize: "clamp(36px, 5vw, 56px)",
                                    fontWeight: theme.typography.fontWeight.bold,
                                    color: theme.colors.textPrimary,
                                    fontFamily: theme.typography.fontFamily.display,
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                }}
                            >
                                {label}
                            </h2>
                        </div>
                        {/* Tagline - không thụt vào, ra ngoài */}
                        <p
                            className={isVisible ? "title-slide-in" : ""}
                            style={{
                                margin: 0,
                                paddingLeft: 0,
                                fontSize: "clamp(16px, 2vw, 20px)",
                                color: theme.colors.textSecondary,
                                fontFamily: theme.typography.fontFamily.body,
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                animationDelay: "0.2s",
                            }}
                        >
                            {config.tagline}
                        </p>
                    </div>

                    {/* Products Carousel */}
                    {products.length === 0 ? (
                        <div
                            style={{
                                padding: `${theme.spacing.xxxl} ${theme.spacing.lg}`,
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
                    ) : (
                        <div style={{ position: "relative" }}>
                            {/* Navigation Arrows */}
                            <button
                                onClick={() => scrollCarousel(-1)}
                                style={{
                                    position: "absolute",
                                    left: -48,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                                    border: "none",
                                    color: theme.colors.textWhite,
                                    fontSize: theme.typography.fontSize["2xl"],
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: theme.shadows.lg,
                                    zIndex: 10,
                                    transition: theme.transitions.normal,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                                    e.currentTarget.style.boxShadow = theme.shadows.xl;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = "translateY(-50%) scale(0.95)";
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                                }}
                                aria-label="Scroll left"
                            >
                                ❮
                            </button>
                            <button
                                onClick={() => scrollCarousel(1)}
                                style={{
                                    position: "absolute",
                                    right: -48,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                                    border: "none",
                                    color: theme.colors.textWhite,
                                    fontSize: theme.typography.fontSize["2xl"],
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: theme.shadows.lg,
                                    zIndex: 10,
                                    transition: theme.transitions.normal,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                                    e.currentTarget.style.boxShadow = theme.shadows.xl;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = "translateY(-50%) scale(0.95)";
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                                }}
                                aria-label="Scroll right"
                            >
                                ❯
                            </button>

                            {/* Products Container */}
                            <div
                                ref={carouselRef}
                                style={{
                                    display: "flex",
                                    gap: theme.spacing.lg,
                                    overflowX: "auto",
                                    overflowY: "hidden",
                                    scrollBehavior: "smooth",
                                    scrollbarWidth: "none", // Firefox
                                    msOverflowStyle: "none", // IE/Edge
                                    paddingBottom: theme.spacing.md,
                                }}
                            >
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                    div[style*="overflow-x: auto"]::-webkit-scrollbar {
                                        display: none; /* Chrome/Safari */
                                    }
                                `
                                }} />
                                {products.map((product, index) => (
                                    <div
                                        key={product._id}
                                        className={isVisible ? "card-animate" : ""}
                                        style={{
                                            flex: "0 0 calc(25% - 18px)",
                                            minWidth: 280,
                                            animationDelay: `${0.3 + index * 0.1}s`,
                                        }}
                                    >
                                        <ProductCard product={product} priority={index < 4} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Responsive styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media (max-width: 1280px) {
                        div[style*="flex: 0 0 calc(25%"] {
                            flex: 0 0 calc(33.333% - 16px) !important;
                        }
                    }
                    @media (max-width: 768px) {
                        button[aria-label="Scroll left"],
                        button[aria-label="Scroll right"] {
                            display: none !important;
                        }
                        div[style*="flex: 0 0 calc(25%"] {
                            flex: 0 0 calc(50% - 12px) !important;
                        }
                    }
                    @media (max-width: 480px) {
                        div[style*="flex: 0 0 calc(25%"] {
                            flex: 0 0 calc(100% - 0px) !important;
                        }
                    }
                `
                }} />
            </section>
        </>
    );
}
