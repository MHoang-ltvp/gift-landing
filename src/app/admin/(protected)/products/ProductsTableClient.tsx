"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/app/components/ProductForm";
import ProductEditModal from "./ProductEditModal";
import { useToast } from "@/app/components/ToastContext";
import type { Product, Occasion } from "@/types";

interface ProductsTableClientProps {
    initialProducts: Product[];
}

const PRIMARY_COLOR = "#7C3AED";
const BG_LIGHT = "#F8F9FA";
const TEXT_PRIMARY = "#1F2937";
const TEXT_SECONDARY = "#6B7280";
const TEXT_TERTIARY = "#9CA3AF";
const BORDER_COLOR = "#E5E7EB";

const occasionLabels: Record<Occasion, string> = {
    tet: "Tết",
    valentine: "Valentine",
    "8-3": "8/3",
};

export default function ProductsTableClient({ initialProducts }: ProductsTableClientProps) {
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [filter, setFilter] = useState<"all" | Occasion>("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"price" | "createdAt">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Refresh products after form submission
    useEffect(() => {
        const refreshProducts = async () => {
            try {
                const res = await fetch("/api/admin/products");
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products || []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        if (!showModal) {
            refreshProducts();
        }
    }, [showModal]);

    // Filter and sort products
    const filteredProducts = products.filter((product) => {
        // Filter by occasion
        if (filter !== "all" && product.occasion !== filter) return false;

        // Filter by status
        if (statusFilter === "active" && !product.active) return false;
        if (statusFilter === "inactive" && product.active) return false;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                product.title.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                occasionLabels[product.occasion]?.toLowerCase().includes(query)
            );
        }

        return true;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price") {
            const priceA = a.price || 0;
            const priceB = b.price || 0;
            return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
        } else {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }
    });

    const handleDelete = async (productId: string) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                showSuccess("Đã xóa sản phẩm thành công!");
                // Cập nhật state ngay lập tức
                setProducts((prev) => prev.filter((p) => p._id !== productId));
            } else {
                showError("Không thể xóa sản phẩm");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            showError("Có lỗi xảy ra khi xóa sản phẩm");
        }
    };

    const handleToggleActive = async (productId: string, currentActive: boolean) => {
        const newActive = !currentActive;
        
        // Optimistic update - cập nhật UI ngay lập tức
        setProducts((prev) =>
            prev.map((p) => (p._id === productId ? { ...p, active: newActive } : p))
        );

        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: newActive }),
            });

            if (res.ok) {
                showSuccess(`Đã ${newActive ? "kích hoạt" : "vô hiệu hóa"} sản phẩm!`);
            } else {
                // Rollback nếu API call thất bại
                setProducts((prev) =>
                    prev.map((p) => (p._id === productId ? { ...p, active: currentActive } : p))
                );
                showError("Không thể cập nhật trạng thái sản phẩm");
            }
        } catch (error) {
            // Rollback nếu có lỗi
            setProducts((prev) =>
                prev.map((p) => (p._id === productId ? { ...p, active: currentActive } : p))
            );
            console.error("Error updating product:", error);
            showError("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm");
        }
    };

    const formatPrice = (price?: number) => {
        if (!price) return "-";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const allCount = products.length;
    const tetCount = products.filter((p) => p.occasion === "tet").length;
    const valentineCount = products.filter((p) => p.occasion === "valentine").length;
    const eightThreeCount = products.filter((p) => p.occasion === "8-3").length;

    return (
        <>
            {/* Header with Add Button */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <h1
                    style={{
                        fontSize: "32px",
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                        margin: 0,
                    }}
                >
                    Products
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        padding: "12px 24px",
                        background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    Add Products
                </button>
            </div>

            {/* Filter Tabs and Search Bar */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "20px 24px",
                    marginBottom: "24px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* Filter Tabs */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                    <button
                        onClick={() => setFilter("all")}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: filter === "all" ? PRIMARY_COLOR : "transparent",
                            color: filter === "all" ? "#ffffff" : TEXT_SECONDARY,
                            fontSize: "14px",
                            fontWeight: filter === "all" ? 500 : 400,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        All {allCount}
                    </button>
                    <button
                        onClick={() => setFilter("tet")}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: filter === "tet" ? PRIMARY_COLOR : "transparent",
                            color: filter === "tet" ? "#ffffff" : TEXT_SECONDARY,
                            fontSize: "14px",
                            fontWeight: filter === "tet" ? 500 : 400,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        Tết {tetCount}
                    </button>
                    <button
                        onClick={() => setFilter("valentine")}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: filter === "valentine" ? PRIMARY_COLOR : "transparent",
                            color: filter === "valentine" ? "#ffffff" : TEXT_SECONDARY,
                            fontSize: "14px",
                            fontWeight: filter === "valentine" ? 500 : 400,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        Valentine {valentineCount}
                    </button>
                    <button
                        onClick={() => setFilter("8-3")}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: filter === "8-3" ? PRIMARY_COLOR : "transparent",
                            color: filter === "8-3" ? "#ffffff" : TEXT_SECONDARY,
                            fontSize: "14px",
                            fontWeight: filter === "8-3" ? 500 : 400,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        8/3 {eightThreeCount}
                    </button>
                </div>

                {/* Search and Filters */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
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
                                fontSize: "18px",
                                color: TEXT_TERTIARY,
                            }}
                        >
                            🔍
                        </span>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                        style={{
                            padding: "10px 16px",
                            border: `1px solid ${BORDER_COLOR}`,
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                            backgroundColor: "#ffffff",
                        }}
                    >
                        <option value="all">Status: All</option>
                        <option value="active">Status: Active</option>
                        <option value="inactive">Status: Inactive</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                }}
            >
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${BORDER_COLOR}`, backgroundColor: "#F9FAFB" }}>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "16px 24px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: TEXT_SECONDARY,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Products
                                </th>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "16px 24px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: TEXT_SECONDARY,
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        userSelect: "none",
                                    }}
                                    onClick={() => {
                                        if (sortBy === "price") {
                                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                        } else {
                                            setSortBy("price");
                                            setSortOrder("asc");
                                        }
                                    }}
                                >
                                    Price
                                    <span style={{ marginLeft: "8px", fontSize: "10px" }}>
                                        {sortBy === "price" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                                    </span>
                                </th>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "16px 24px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: TEXT_SECONDARY,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Status
                                </th>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "16px 24px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: TEXT_SECONDARY,
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        userSelect: "none",
                                    }}
                                    onClick={() => {
                                        if (sortBy === "createdAt") {
                                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                        } else {
                                            setSortBy("createdAt");
                                            setSortOrder("desc");
                                        }
                                    }}
                                >
                                    Created At
                                    <span style={{ marginLeft: "8px", fontSize: "10px" }}>
                                        {sortBy === "createdAt" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                                    </span>
                                </th>
                                <th
                                    style={{
                                        textAlign: "right",
                                        padding: "16px 24px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: TEXT_SECONDARY,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: TEXT_SECONDARY }}>
                                        Không có sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                sortedProducts.map((product) => (
                                    <tr
                                        key={product._id}
                                        style={{
                                            borderBottom: `1px solid ${BORDER_COLOR}`,
                                            transition: "background-color 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#F9FAFB";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }}
                                    >
                                        <td style={{ padding: "16px 24px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                {product.image && (
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        style={{
                                                            width: "48px",
                                                            height: "48px",
                                                            borderRadius: "8px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                )}
                                                <div>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: 500,
                                                            color: TEXT_PRIMARY,
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        {product.title}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: TEXT_SECONDARY,
                                                            padding: "2px 8px",
                                                            backgroundColor: "#F3F4F6",
                                                            borderRadius: "4px",
                                                            display: "inline-block",
                                                        }}
                                                    >
                                                        {occasionLabels[product.occasion]}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px 24px", fontSize: "14px", color: TEXT_PRIMARY }}>
                                            {formatPrice(product.price)}
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    padding: "4px 12px",
                                                    borderRadius: "8px",
                                                    fontSize: "12px",
                                                    fontWeight: 500,
                                                    backgroundColor: product.active ? "#DCFCE7" : "#FEE2E2",
                                                    color: product.active ? "#22C55E" : "#EF4444",
                                                }}
                                            >
                                                {product.active ? "✓ Published" : "✗ Inactive"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px 24px", fontSize: "14px", color: TEXT_SECONDARY }}>
                                            {formatDate(product.createdAt)}
                                        </td>
                                        <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                                <button
                                                    onClick={() => setEditingProduct(product)}
                                                    style={{
                                                        padding: "8px",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        backgroundColor: PRIMARY_COLOR,
                                                        color: "#ffffff",
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
                                                <button
                                                    onClick={() => handleToggleActive(product._id || "", product.active)}
                                                    style={{
                                                        padding: "8px",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        backgroundColor: product.active ? "#DCFCE7" : "#FEF3C7",
                                                        color: product.active ? "#059669" : "#D97706",
                                                        fontSize: "16px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "32px",
                                                        height: "32px",
                                                    }}
                                                    title={product.active ? "Tạm dừng" : "Kích hoạt"}
                                                >
                                                    {product.active ? "▶️" : "⏸️"}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id || "")}
                                                    style={{
                                                        padding: "8px",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        backgroundColor: "#FEE2E2",
                                                        color: "#EF4444",
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add Product */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "20px",
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            width: "100%",
                            maxWidth: "800px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                padding: "24px",
                                borderBottom: `1px solid ${BORDER_COLOR}`,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#ffffff",
                                zIndex: 10,
                            }}
                        >
                            <h2 style={{ fontSize: "20px", fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>
                                Thêm sản phẩm mới
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                    fontSize: "20px",
                                    color: TEXT_SECONDARY,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{ padding: "24px" }}>
                            <ProductForm onSuccess={() => setShowModal(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <ProductEditModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSuccess={() => {
                        setEditingProduct(null);
                        router.refresh();
                    }}
                />
            )}
        </>
    );
}

