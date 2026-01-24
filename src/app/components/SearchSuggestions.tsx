"use client";

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/types";
import { theme } from "@/lib/theme";
import { useRouter } from "next/navigation";

interface SearchSuggestionsProps {
    searchQuery: string;
    allProducts: Product[];
    isVisible: boolean;
    onClose: () => void;
}

export default function SearchSuggestions({ searchQuery, allProducts, isVisible, onClose }: SearchSuggestionsProps) {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!searchQuery.trim() || !isVisible) {
            setFilteredProducts([]);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = allProducts
            .filter((product) => {
                const titleMatch = product.title.toLowerCase().includes(query);
                const descriptionMatch = product.description?.toLowerCase().includes(query) || false;
                return titleMatch || descriptionMatch;
            })
            .slice(0, 5); // Chỉ hiển thị 5 sản phẩm đầu tiên

        setFilteredProducts(filtered);
    }, [searchQuery, allProducts, isVisible]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isVisible, onClose]);

    if (!isVisible || !searchQuery.trim()) {
        return null;
    }

    const handleProductClick = (product: Product) => {
        // Scroll to product section
        const sectionId = product.occasion;
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
        onClose();
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: theme.spacing.xs,
                backgroundColor: theme.colors.bgWhite,
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadows.xl,
                border: `1px solid ${theme.colors.borderLight}`,
                zIndex: 1000,
                maxHeight: "400px",
                overflowY: "auto",
            }}
        >
            {filteredProducts.length === 0 ? (
                <div
                    style={{
                        padding: theme.spacing.xl,
                        textAlign: "center",
                        color: theme.colors.textSecondary,
                    }}
                >
                    <div style={{ fontSize: 32, marginBottom: theme.spacing.sm }}>🔍</div>
                    <p style={{ margin: 0, fontSize: theme.typography.fontSize.md }}>
                        Không tìm thấy sản phẩm nào
                    </p>
                </div>
            ) : (
                <>
                    <div
                        style={{
                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                            borderBottom: `1px solid ${theme.colors.borderLight}`,
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.semibold,
                            color: theme.colors.textSecondary,
                        }}
                    >
                        Sản phẩm gợi ý ({filteredProducts.length})
                    </div>
                    <div>
                        {filteredProducts.map((product) => {
                            const imageUrl = product.image || `https://via.placeholder.com/60x60/${theme.colors.primary.replace("#", "")}/ffffff?text=${encodeURIComponent(product.title.substring(0, 2))}`;
                            
                            return (
                                <div
                                    key={product._id}
                                    onClick={() => handleProductClick(product)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: theme.spacing.md,
                                        padding: theme.spacing.md,
                                        cursor: "pointer",
                                        borderBottom: `1px solid ${theme.colors.borderLight}`,
                                        transition: theme.transitions.normal,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.colors.bgPrimary;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.colors.bgWhite;
                                    }}
                                >
                                    {/* Product Image */}
                                    <div
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: theme.borderRadius.md,
                                            overflow: "hidden",
                                            flexShrink: 0,
                                            backgroundColor: theme.colors.bgGray,
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

                                    {/* Product Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h4
                                            style={{
                                                margin: 0,
                                                fontSize: theme.typography.fontSize.md,
                                                fontWeight: theme.typography.fontWeight.semibold,
                                                color: theme.colors.textPrimary,
                                                marginBottom: theme.spacing.xs,
                                                fontFamily: theme.typography.fontFamily.body,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {product.title}
                                        </h4>
                                        {product.description && (
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: theme.typography.fontSize.sm,
                                                    color: theme.colors.textSecondary,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    fontFamily: theme.typography.fontFamily.body,
                                                }}
                                            >
                                                {product.description}
                                            </p>
                                        )}
                                        {product.price && (
                                            <p
                                                style={{
                                                    margin: `${theme.spacing.xs} 0 0 0`,
                                                    fontSize: theme.typography.fontSize.md,
                                                    fontWeight: theme.typography.fontWeight.bold,
                                                    color: theme.colors.primary,
                                                    fontFamily: theme.typography.fontFamily.body,
                                                }}
                                            >
                                                {product.price.toLocaleString("vi-VN")}₫
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

