"use client";

import { useEffect, useState } from "react";
import { theme } from "@/lib/theme";
import SearchSuggestions from "./SearchSuggestions";
import type { Product } from "@/types";

interface HeaderProps {
    allProducts?: Product[];
}

export default function Header({ allProducts = [] }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeInDown {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                    }
                    .header-animate {
                        animation: fadeInDown 0.6s ease-out forwards;
                    }
                    .logo-pulse {
                        animation: pulse 2s ease-in-out infinite;
                    }
                `
            }} />
            <header
                style={{
                    backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : theme.colors.bgWhite,
                    borderBottom: `1px solid ${theme.colors.borderLight}`,
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    boxShadow: scrolled ? theme.shadows.md : theme.shadows.sm,
                    backdropFilter: "blur(10px)",
                    transition: theme.transitions.slow,
                }}
                className="header-animate"
            >
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: theme.spacing.md,
                        flexWrap: "wrap",
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            fontSize: theme.typography.fontSize["4xl"],
                            fontWeight: theme.typography.fontWeight.bold,
                            color: theme.colors.primary,
                            cursor: "pointer",
                            fontFamily: theme.typography.fontFamily.display,
                            transition: theme.transitions.normal,
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing.sm,
                        }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = theme.colors.primaryDark;
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = theme.colors.primary;
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        {/* <img src="https://res.cloudinary.com/djpnd5vb8/image/upload/v1769570004/z7470924509635_2b31184291f5edb777e5933d03dad08a_qmibyr.jpg"></img> */}
                        <span>Gói Ghém</span>
                    </div>

                    {/* Search Bar */}
                    <div style={{ flex: "1 1 300px", maxWidth: 500, position: "relative", margin: "0 auto" }}>
                        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 1, color: theme.colors.textTertiary, pointerEvents: "none" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={(e) => {
                                const query = e.target.value;
                                setSearchQuery(query);
                                setShowSuggestions(query.trim().length > 0);
                            }}
                            style={{
                                width: "100%",
                                padding: `${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} 40px`,
                                border: `1px solid ${theme.colors.borderMedium}`,
                                borderRadius: theme.borderRadius.full,
                                fontSize: theme.typography.fontSize.sm,
                                outline: "none",
                                backgroundColor: theme.colors.bgWhite,
                                transition: theme.transitions.normal,
                                fontFamily: theme.typography.fontFamily.body,
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = theme.colors.primary;
                                e.currentTarget.style.boxShadow = theme.shadows.sm;
                                if (searchQuery.trim().length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = theme.colors.borderMedium;
                                e.currentTarget.style.boxShadow = "none";
                                // Delay để cho phép click vào suggestions
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                        />
                        {/* Search Suggestions Dropdown */}
                        {allProducts.length > 0 && (
                            <SearchSuggestions
                                searchQuery={searchQuery}
                                allProducts={allProducts}
                                isVisible={showSuggestions}
                                onClose={() => setShowSuggestions(false)}
                            />
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav
                        style={{
                            display: "flex",
                            gap: theme.spacing.md,
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            { id: "tet", label: "Tết" },
                            { id: "valentine", label: "Valentine" },
                            { id: "8-3", label: "Quốc tế phụ nữ" },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                style={{
                                    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                                    backgroundColor: "transparent",
                                    border: `1px solid ${theme.colors.primary}`,
                                    borderRadius: theme.borderRadius.full,
                                    color: theme.colors.primary,
                                    cursor: "pointer",
                                    fontSize: theme.typography.fontSize.sm,
                                    fontWeight: theme.typography.fontWeight.medium,
                                    transition: theme.transitions.normal,
                                    fontFamily: theme.typography.fontFamily.body,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                                    e.currentTarget.style.color = theme.colors.textWhite;
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = theme.shadows.md;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = theme.colors.primary;
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>
        </>
    );
}
