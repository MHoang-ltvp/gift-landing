"use client";

import { useEffect, useState, useRef } from "react";
import { theme } from "@/lib/theme";
import type { Settings } from "@/types";

export default function Footer() {
    const [isVisible, setIsVisible] = useState(false);
    const [settings, setSettings] = useState<Settings["socialLinks"] | null>(null);
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        // Load settings for social links
        fetch("/api/admin/settings")
            .then((res) => res.json())
            .then((data) => {
                if (data.socialLinks) {
                    setSettings(data.socialLinks);
                }
            })
            .catch((error) => {
                console.error("Error loading settings:", error);
                // Use default settings on error
                setSettings({
                    instagram: { enabled: true, url: "#" },
                    facebook: { enabled: true, url: "#" },
                    youtube: { enabled: true, url: "#" },
                    tiktok: { enabled: true, url: "#" },
                });
            });
    }, []);
    const hanoiAddresses = [
        "81 Bà Triệu, Hai Bà Trưng",
        "241 Chùa Bộc, Đống Đa",
        "60 Trần Đại Nghĩa, Hai Bà Trưng",
        "226 Nguyễn Trãi, Nam Từ Liêm (gần ĐH Hà Nội)",
        "157 Xuân Thủy, Cầu Giấy",
    ];

    const SocialIcon = ({ children, name }: { children: React.ReactNode; name: string }) => (
        <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {children}
        </div>
    );

    // Build social links from settings
    const socialLinks = settings
        ? [
              settings.instagram?.enabled && {
                  name: "Instagram",
                  icon: (
                      <SocialIcon name="Instagram">
                          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                      </SocialIcon>
                  ),
                  url: settings.instagram.url || "#",
              },
              settings.facebook?.enabled && {
                  name: "Facebook",
                  icon: (
                      <SocialIcon name="Facebook">
                          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                      </SocialIcon>
                  ),
                  url: settings.facebook.url || "#",
              },
              settings.youtube?.enabled && {
                  name: "YouTube",
                  icon: (
                      <SocialIcon name="YouTube">
                          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                      </SocialIcon>
                  ),
                  url: settings.youtube.url || "#",
              },
              settings.tiktok?.enabled && {
                  name: "TikTok",
                  icon: (
                      <SocialIcon name="TikTok">
                          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                      </SocialIcon>
                  ),
                  url: settings.tiktok.url || "#",
              },
          ].filter(Boolean)
        : [];

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    .footer-fade-in {
                        animation: fadeIn 1s ease-out forwards;
                    }
                `
            }} />
            <footer
                ref={footerRef}
                className={isVisible ? "footer-fade-in" : ""}
                style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
                    color: theme.colors.textWhite,
                    padding: `${theme.spacing.xxl} ${theme.spacing.lg} ${theme.spacing.lg}`,
                    opacity: isVisible ? 1 : 0,
                }}
            >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: theme.spacing.xl,
                        marginBottom: theme.spacing.xl,
                    }}
                >
                    {/* Contact Information */}
                    <div>
                        <h3
                            style={{
                                fontSize: theme.typography.fontSize.lg,
                                fontWeight: theme.typography.fontWeight.semibold,
                                marginBottom: theme.spacing.md,
                                fontFamily: theme.typography.fontFamily.body,
                            }}
                        >
                            Liên hệ
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
                            {[
                                { label: "Hotline", value: "0968118025" },
                                { label: "Email", value: "goighem2026@gmail.com" },
                            ].map((item, index) => (
                                <div key={index} style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
                                    <div style={{ fontSize: theme.typography.fontSize.sm, opacity: 0.9, fontFamily: theme.typography.fontFamily.body }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.medium, fontFamily: theme.typography.fontFamily.body }}>
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Store Locations - Hà Nội */}
                    <div>
                        <h3
                            style={{
                                fontSize: theme.typography.fontSize.lg,
                                fontWeight: theme.typography.fontWeight.semibold,
                                marginBottom: theme.spacing.md,
                                fontFamily: theme.typography.fontFamily.body,
                            }}
                        >
                            HÀ NỘI (9h - 22h)
                        </h3>
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: theme.spacing.sm,
                            }}
                        >
                            {hanoiAddresses.map((address, index) => (
                                <li
                                    key={index}
                                    style={{
                                        fontSize: theme.typography.fontSize.sm,
                                        lineHeight: 1.6,
                                        opacity: 0.9,
                                        fontFamily: theme.typography.fontFamily.body,
                                    }}
                                >
                                    • {address}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Brand and Social Media */}
                    <div>
                        <div style={{ marginBottom: theme.spacing.lg }}>
                            <div
                                style={{
                                    fontSize: theme.typography.fontSize["4xl"],
                                    fontWeight: theme.typography.fontWeight.bold,
                                    marginBottom: theme.spacing.sm,
                                    fontFamily: theme.typography.fontFamily.display,
                                }}
                            >
                                Gói Ghém
                            </div>
                            <div
                                style={{
                                    fontSize: theme.typography.fontSize.sm,
                                    opacity: 0.9,
                                    fontFamily: theme.typography.fontFamily.body,
                                }}
                            >
                                Quà tặng & Phụ kiện
                            </div>
                        </div>

                        <div style={{ marginBottom: theme.spacing.md }}>
                            <p style={{ fontSize: theme.typography.fontSize.sm, marginBottom: theme.spacing.md, opacity: 0.9, fontFamily: theme.typography.fontFamily.body }}>
                                Hãy kết nối với chúng mình
                            </p>
                            {socialLinks.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: theme.spacing.md,
                                    }}
                                >
                                    {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: theme.colors.textWhite,
                                            textDecoration: "none",
                                            transition: theme.transitions.normal,
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                                            e.currentTarget.style.transform = "scale(1.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                                            e.currentTarget.style.transform = "scale(1)";
                                        }}
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div
                    style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                        paddingTop: theme.spacing.lg,
                        textAlign: "center",
                        fontSize: theme.typography.fontSize.sm,
                        opacity: 0.8,
                        fontFamily: theme.typography.fontFamily.body,
                    }}
                >
                    © {new Date().getFullYear()} Gói Ghém. All rights reserved.
                </div>
            </div>
        </footer>
        </>
    );
}
