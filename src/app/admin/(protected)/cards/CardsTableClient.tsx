"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ToastContext";
import type { Card, CardOccasion } from "@/types";
import CardFormModal from "./CardFormModal";
import CardEditModal from "./CardEditModal";

interface CardsTableClientProps {
    initialCards: Card[];
}

const PRIMARY_COLOR = "#7C3AED";
const BG_LIGHT = "#F8F9FA";
const TEXT_PRIMARY = "#1F2937";
const TEXT_SECONDARY = "#6B7280";
const TEXT_TERTIARY = "#9CA3AF";
const BORDER_COLOR = "#E5E7EB";

const occasionLabels: Record<CardOccasion, string> = {
    newyear: "Năm Mới",
    valentine: "Valentine",
    womensday: "8/3",
};

export default function CardsTableClient({ initialCards }: CardsTableClientProps) {
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    const [cards, setCards] = useState<Card[]>(initialCards);
    const [showModal, setShowModal] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [filter, setFilter] = useState<"all" | CardOccasion>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"createdAt">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Refresh cards after form submission
    useEffect(() => {
        const refreshCards = async () => {
            try {
                const res = await fetch("/api/admin/cards");
                if (res.ok) {
                    const data = await res.json();
                    setCards(data.cards || []);
                }
            } catch (error) {
                console.error("Error fetching cards:", error);
            }
        };

        if (!showModal) {
            refreshCards();
        }
    }, [showModal]);

    // Filter and sort cards
    const filteredCards = cards.filter((card) => {
        // Filter by occasion
        if (filter !== "all" && card.occasion !== filter) return false;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                card.code.toLowerCase().includes(query) ||
                card.payload?.toName?.toLowerCase().includes(query) ||
                card.payload?.fromName?.toLowerCase().includes(query) ||
                card.payload?.message?.toLowerCase().includes(query) ||
                (card.occasion && occasionLabels[card.occasion]?.toLowerCase().includes(query))
            );
        }

        return true;
    });

    const sortedCards = [...filteredCards].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    const handleDelete = async (cardId: string) => {
        if (!confirm("Bạn có chắc muốn xóa thiệp này?")) return;

        try {
            const res = await fetch(`/api/admin/cards/${cardId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                showSuccess("Đã xóa thiệp thành công!");
                // Cập nhật state ngay lập tức
                setCards((prev) => prev.filter((c) => c._id !== cardId));
            } else {
                showError("Không thể xóa thiệp");
            }
        } catch (error) {
            console.error("Error deleting card:", error);
            showError("Có lỗi xảy ra khi xóa thiệp");
        }
    };

    const handleCardAdded = () => {
        setShowModal(false);
        router.refresh();
    };

    const handleCardUpdated = () => {
        setEditingCard(null);
        router.refresh();
    };

    const occasionCounts = cards.reduce(
        (acc, card) => {
            const occ = card.occasion || "newyear";
            acc[occ] = (acc[occ] || 0) + 1;
            return acc;
        },
        {} as Record<CardOccasion, number>
    );

    const totalCount = cards.length;

    return (
        <>
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    padding: "24px",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Cards</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            padding: "10px 20px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 600,
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        + Add Cards
                    </button>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    {[
                        { value: "all" as const, label: "All", count: totalCount },
                        { value: "newyear" as const, label: "Năm Mới", count: occasionCounts.newyear || 0 },
                        { value: "valentine" as const, label: "Valentine", count: occasionCounts.valentine || 0 },
                        { value: "womensday" as const, label: "8/3", count: occasionCounts.womensday || 0 },
                    ].map((tab) => {
                        const isActive = filter === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setFilter(tab.value)}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: isActive ? PRIMARY_COLOR : "#ffffff",
                                    color: isActive ? "#ffffff" : TEXT_SECONDARY,
                                    border: `1px solid ${isActive ? PRIMARY_COLOR : BORDER_COLOR}`,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: isActive ? 600 : 400,
                                    transition: "all 0.2s",
                                }}
                            >
                                {tab.label} {tab.count}
                            </button>
                        );
                    })}
                </div>

                {/* Search and Sort */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 16px 10px 40px",
                                border: `1px solid ${BORDER_COLOR}`,
                                borderRadius: "8px",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: "16px",
                                color: TEXT_TERTIARY,
                            }}
                        >
                            🔍
                        </span>
                    </div>
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [newSortBy, newSortOrder] = e.target.value.split("-") as ["createdAt", "asc" | "desc"];
                            setSortBy(newSortBy);
                            setSortOrder(newSortOrder);
                        }}
                        style={{
                            padding: "10px 16px",
                            border: `1px solid ${BORDER_COLOR}`,
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                        }}
                    >
                        <option value="createdAt-desc">Created At: Newest</option>
                        <option value="createdAt-asc">Created At: Oldest</option>
                    </select>
                </div>

                {/* Table */}
                {sortedCards.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px", color: TEXT_SECONDARY }}>
                        <p>No cards found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                            <thead>
                                <tr style={{ backgroundColor: BG_LIGHT }}>
                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px 16px",
                                            fontSize: "12px",
                                            color: TEXT_SECONDARY,
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            borderTopLeftRadius: "8px",
                                            borderBottomLeftRadius: "8px",
                                        }}
                                    >
                                        CODE
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px 16px",
                                            fontSize: "12px",
                                            color: TEXT_SECONDARY,
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        OCCASION
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px 16px",
                                            fontSize: "12px",
                                            color: TEXT_SECONDARY,
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        RECIPIENT
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px 16px",
                                            fontSize: "12px",
                                            color: TEXT_SECONDARY,
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        SENDER
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px 16px",
                                            fontSize: "12px",
                                            color: TEXT_SECONDARY,
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        QR IMAGE
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px 16px",
                                            fontSize: "12px",
                                            color: TEXT_SECONDARY,
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        CREATED AT
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "right",
                                            padding: "12px 16px",
                                            fontSize: "12px",
                                            color: TEXT_SECONDARY,
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            borderTopRightRadius: "8px",
                                            borderBottomRightRadius: "8px",
                                        }}
                                    >
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedCards.map((card) => (
                                    <tr
                                        key={card._id}
                                        style={{
                                            backgroundColor: "#ffffff",
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
                                        }}
                                    >
                                        <td style={{ padding: "16px", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>
                                            <div style={{ fontSize: "14px", fontWeight: 500, color: TEXT_PRIMARY }}>{card.code}</div>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <span
                                                style={{
                                                    backgroundColor: "#F3F4F6",
                                                    color: PRIMARY_COLOR,
                                                    padding: "4px 12px",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {card.occasion ? occasionLabels[card.occasion] : "Năm Mới"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", fontSize: "14px", color: TEXT_PRIMARY }}>
                                            {card.payload?.toName || "-"}
                                        </td>
                                        <td style={{ padding: "16px", fontSize: "14px", color: TEXT_PRIMARY }}>
                                            {card.payload?.fromName || "-"}
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            {card.qrImageUrl ? (
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <img
                                                        src={card.qrImageUrl}
                                                        alt="QR Code"
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
                                                            objectFit: "cover",
                                                            borderRadius: "6px",
                                                            border: `1px solid ${BORDER_COLOR}`,
                                                        }}
                                                    />
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const response = await fetch(card.qrImageUrl!);
                                                                const blob = await response.blob();
                                                                const url = window.URL.createObjectURL(blob);
                                                                const a = document.createElement("a");
                                                                a.href = url;
                                                                a.download = `qr-card-${card.code}.png`;
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                                window.URL.revokeObjectURL(url);
                                                                showSuccess("Đã tải QR code thành công!");
                                                            } catch (error) {
                                                                console.error("Error downloading QR:", error);
                                                                showError("Không thể tải QR code");
                                                            }
                                                        }}
                                                        style={{
                                                            padding: "6px 10px",
                                                            backgroundColor: "#10B981",
                                                            color: "#ffffff",
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            fontSize: "12px",
                                                            cursor: "pointer",
                                                            fontWeight: 500,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "4px",
                                                        }}
                                                        title="Tải QR code"
                                                    >
                                                        ⬇️ Tải
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: "12px", color: TEXT_TERTIARY }}>Chưa có</span>
                                            )}
                                        </td>
                                        <td style={{ padding: "16px", fontSize: "14px", color: TEXT_SECONDARY }}>
                                            {new Date(card.createdAt).toLocaleString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right", borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }}>
                                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                                <button
                                                    onClick={() => setEditingCard(card)}
                                                    style={{
                                                        padding: "8px",
                                                        backgroundColor: PRIMARY_COLOR,
                                                        color: "#ffffff",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        fontSize: "16px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "32px",
                                                        height: "32px",
                                                    }}
                                                    title="Chỉnh sửa"
                                                >
                                                    ✏️
                                                </button>
                                                <a
                                                    href={`/c/${card.code}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        padding: "8px",
                                                        backgroundColor: "#3B82F6",
                                                        color: "#ffffff",
                                                        textDecoration: "none",
                                                        borderRadius: "6px",
                                                        fontSize: "16px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "32px",
                                                        height: "32px",
                                                    }}
                                                    title="Xem thiệp"
                                                >
                                                    👁️
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(card._id || "")}
                                                    style={{
                                                        padding: "8px",
                                                        backgroundColor: "#FEE2E2",
                                                        color: "#EF4444",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        fontSize: "16px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "32px",
                                                        height: "32px",
                                                    }}
                                                    title="Xóa"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Card Modal */}
            {showModal && <CardFormModal onClose={() => setShowModal(false)} onSuccess={handleCardAdded} />}
            
            {/* Edit Card Modal */}
            {editingCard && <CardEditModal card={editingCard} onClose={() => setEditingCard(null)} onSuccess={handleCardUpdated} />}
        </>
    );
}

