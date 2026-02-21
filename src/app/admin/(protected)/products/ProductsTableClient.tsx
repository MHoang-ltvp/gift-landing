"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/app/components/ProductForm";
import ProductEditModal from "./ProductEditModal";
import { useToast } from "@/app/components/ToastContext";
import type { Product, Occasion } from "@/types";
import { SUB_CATEGORIES_BY_OCCASION } from "@/types";

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
    const [subCategoryFilter, setSubCategoryFilter] = useState<string | "all">("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"price" | "createdAt">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
    const [deletingAll, setDeletingAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Refresh products after form submission
    useEffect(() => {
        const refreshProducts = async () => {
            try {
                const res = await fetch("/api/admin/products", { credentials: "include" });
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

        // Filter by subCategory (bộ sưu tập)
        if (filter !== "all" && subCategoryFilter !== "all" && product.subCategory !== subCategoryFilter) return false;

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

    // Pagination calculations
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    // Reset subCategory filter when occasion filter changes
    useEffect(() => {
        setSubCategoryFilter("all");
    }, [filter]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, subCategoryFilter, statusFilter, searchQuery]);

    const handleDeleteAll = async () => {
        setDeletingAll(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setProducts([]);
                setShowDeleteAllConfirm(false);
                showSuccess(data.message || "Đã xóa toàn bộ sản phẩm!");
            } else {
                const msg = res.status === 401
                    ? "Phiên đăng nhập hết hạn. Vui lòng đăng xuất và đăng nhập lại."
                    : (data.error || "Không thể xóa sản phẩm");
                showError(msg);
            }
        } catch (error) {
            console.error("Error deleting all products:", error);
            showError("Có lỗi xảy ra khi xóa sản phẩm");
        } finally {
            setDeletingAll(false);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                showSuccess("Đã xóa sản phẩm thành công!");
                setProducts((prev) => prev.filter((p) => p._id !== productId));
            } else {
                const msg = res.status === 401
                    ? "Phiên đăng nhập hết hạn. Vui lòng đăng xuất và đăng nhập lại."
                    : (data.error || "Không thể xóa sản phẩm");
                showError(msg);
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
                credentials: "include",
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
            {/* Header with Add Button and Delete All */}
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
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {products.length > 0 && (
                        <button
                            onClick={() => setShowDeleteAllConfirm(true)}
                            style={{
                                padding: "12px 24px",
                                background: "#ffffff",
                                color: "#dc2626",
                                border: "1px solid #dc2626",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#dc2626";
                                e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#ffffff";
                                e.currentTarget.style.color = "#dc2626";
                            }}
                        >
                            Xóa tất cả
                        </button>
                    )}
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
            </div>

            {/* Modal xác nhận xóa tất cả */}
            {showDeleteAllConfirm && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => !deletingAll && setShowDeleteAllConfirm(false)}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            padding: "24px",
                            maxWidth: "400px",
                            width: "90%",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: "0 0 12px", fontSize: "18px", color: TEXT_PRIMARY }}>
                            Xóa toàn bộ sản phẩm?
                        </h3>
                        <p style={{ margin: "0 0 20px", fontSize: "14px", color: TEXT_SECONDARY, lineHeight: 1.5 }}>
                            Bạn có chắc muốn xóa toàn bộ {products.length} sản phẩm? Hành động này không thể hoàn tác.
                        </p>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                            <button
                                onClick={() => !deletingAll && setShowDeleteAllConfirm(false)}
                                disabled={deletingAll}
                                style={{
                                    padding: "10px 20px",
                                    border: `1px solid ${BORDER_COLOR}`,
                                    borderRadius: "8px",
                                    background: "#fff",
                                    color: TEXT_SECONDARY,
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    cursor: deletingAll ? "not-allowed" : "pointer",
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                disabled={deletingAll}
                                style={{
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background: "#dc2626",
                                    color: "#fff",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    cursor: deletingAll ? "not-allowed" : "pointer",
                                    opacity: deletingAll ? 0.7 : 1,
                                }}
                            >
                                {deletingAll ? "Đang xóa..." : "Xóa tất cả"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

                {/* SubCategory Tabs (Bộ sưu tập) - chỉ hiển thị khi đã chọn một occasion */}
                {filter !== "all" && SUB_CATEGORIES_BY_OCCASION[filter] && (
                    <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", paddingTop: "12px", borderTop: `1px solid ${BORDER_COLOR}` }}>
                        <button
                            onClick={() => setSubCategoryFilter("all")}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: subCategoryFilter === "all" ? "#E9D5FF" : "#F3F4F6",
                                color: subCategoryFilter === "all" ? PRIMARY_COLOR : TEXT_SECONDARY,
                                fontSize: "13px",
                                fontWeight: subCategoryFilter === "all" ? 500 : 400,
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            Tất cả
                        </button>
                        {SUB_CATEGORIES_BY_OCCASION[filter].map((subCat) => {
                            const count = products.filter(
                                (p) => p.occasion === filter && p.subCategory === subCat.value
                            ).length;
                            return (
                                <button
                                    key={subCat.value}
                                    onClick={() => setSubCategoryFilter(subCat.value)}
                                    style={{
                                        padding: "6px 14px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: subCategoryFilter === subCat.value ? "#E9D5FF" : "#F3F4F6",
                                        color: subCategoryFilter === subCat.value ? PRIMARY_COLOR : TEXT_SECONDARY,
                                        fontSize: "13px",
                                        fontWeight: subCategoryFilter === subCat.value ? 500 : 400,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {subCat.label} {count > 0 && `(${count})`}
                                </button>
                            );
                        })}
                    </div>
                )}

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
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: TEXT_SECONDARY }}>
                                        Không có sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product) => (
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

            {/* Pagination Controls */}
            {sortedProducts.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "24px",
                        padding: "16px 24px",
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "14px", color: TEXT_SECONDARY }}>
                            Hiển thị {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} trong tổng số {sortedProducts.length} sản phẩm
                        </span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            style={{
                                padding: "8px 12px",
                                border: `1px solid ${BORDER_COLOR}`,
                                borderRadius: "8px",
                                fontSize: "14px",
                                outline: "none",
                                cursor: "pointer",
                                backgroundColor: "#ffffff",
                            }}
                        >
                            <option value={5}>5 / trang</option>
                            <option value={10}>10 / trang</option>
                            <option value={20}>20 / trang</option>
                            <option value={50}>50 / trang</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: "8px 12px",
                                border: `1px solid ${BORDER_COLOR}`,
                                borderRadius: "8px",
                                backgroundColor: currentPage === 1 ? "#F3F4F6" : "#ffffff",
                                color: currentPage === 1 ? TEXT_TERTIARY : TEXT_PRIMARY,
                                fontSize: "14px",
                                fontWeight: 500,
                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                if (currentPage !== 1) {
                                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentPage !== 1) {
                                    e.currentTarget.style.backgroundColor = "#ffffff";
                                }
                            }}
                        >
                            «
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            style={{
                                padding: "8px 12px",
                                border: `1px solid ${BORDER_COLOR}`,
                                borderRadius: "8px",
                                backgroundColor: currentPage === 1 ? "#F3F4F6" : "#ffffff",
                                color: currentPage === 1 ? TEXT_TERTIARY : TEXT_PRIMARY,
                                fontSize: "14px",
                                fontWeight: 500,
                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                if (currentPage !== 1) {
                                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentPage !== 1) {
                                    e.currentTarget.style.backgroundColor = "#ffffff";
                                }
                            }}
                        >
                            ‹
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    style={{
                                        padding: "8px 12px",
                                        border: `1px solid ${currentPage === pageNum ? PRIMARY_COLOR : BORDER_COLOR}`,
                                        borderRadius: "8px",
                                        backgroundColor: currentPage === pageNum ? PRIMARY_COLOR : "#ffffff",
                                        color: currentPage === pageNum ? "#ffffff" : TEXT_PRIMARY,
                                        fontSize: "14px",
                                        fontWeight: currentPage === pageNum ? 600 : 500,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        minWidth: "40px",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (currentPage !== pageNum) {
                                            e.currentTarget.style.backgroundColor = "#F9FAFB";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentPage !== pageNum) {
                                            e.currentTarget.style.backgroundColor = "#ffffff";
                                        }
                                    }}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: "8px 12px",
                                border: `1px solid ${BORDER_COLOR}`,
                                borderRadius: "8px",
                                backgroundColor: currentPage === totalPages ? "#F3F4F6" : "#ffffff",
                                color: currentPage === totalPages ? TEXT_TERTIARY : TEXT_PRIMARY,
                                fontSize: "14px",
                                fontWeight: 500,
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                if (currentPage !== totalPages) {
                                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentPage !== totalPages) {
                                    e.currentTarget.style.backgroundColor = "#ffffff";
                                }
                            }}
                        >
                            ›
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: "8px 12px",
                                border: `1px solid ${BORDER_COLOR}`,
                                borderRadius: "8px",
                                backgroundColor: currentPage === totalPages ? "#F3F4F6" : "#ffffff",
                                color: currentPage === totalPages ? TEXT_TERTIARY : TEXT_PRIMARY,
                                fontSize: "14px",
                                fontWeight: 500,
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                if (currentPage !== totalPages) {
                                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentPage !== totalPages) {
                                    e.currentTarget.style.backgroundColor = "#ffffff";
                                }
                            }}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}

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

