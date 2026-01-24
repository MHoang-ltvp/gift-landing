import { getDb } from "@/lib/db";
import ProductForm from "@/app/components/ProductForm";
import ProductCard from "@/app/components/ProductCard";
import { theme } from "@/lib/theme";
import type { Product, Occasion } from "@/types";

async function getProducts() {
    const db = await getDb();
    const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    
    // Convert MongoDB documents to plain objects
    return products.map((product: any) => ({
        _id: product._id.toString(),
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        images: product.images,
        occasion: product.occasion,
        active: product.active,
        createdAt: product.createdAt,
    })) as Product[];
}

export default async function AdminProducts() {
    const products = await getProducts();

    const occasionLabels: Record<Occasion, string> = {
        tet: "Tết",
        valentine: "Valentine",
        "8-3": "8/3",
    };

    // Group products by occasion
    const productsByOccasion: Record<Occasion, Product[]> = {
        tet: products.filter((p) => p.occasion === "tet"),
        valentine: products.filter((p) => p.occasion === "valentine"),
        "8-3": products.filter((p) => p.occasion === "8-3"),
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                fontFamily: theme.typography.fontFamily.body,
                background: "linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)",
                padding: theme.spacing.xl,
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: theme.spacing.xl }}>
                    <a
                        href="/admin"
                        style={{
                            color: theme.colors.primary,
                            textDecoration: "none",
                            fontSize: theme.typography.fontSize.md,
                            fontWeight: theme.typography.fontWeight.medium,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: theme.spacing.xs,
                            marginBottom: theme.spacing.md,
                            transition: theme.transitions.normal,
                        }}
                    >
                        ← Về Admin
                    </a>
                    <h1
                        style={{
                            fontSize: theme.typography.fontSize["4xl"],
                            fontWeight: theme.typography.fontWeight.bold,
                            color: theme.colors.textPrimary,
                            margin: 0,
                            fontFamily: theme.typography.fontFamily.display,
                        }}
                    >
                        Quản lý Sản phẩm
                    </h1>
                    <p style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm, fontSize: theme.typography.fontSize.md }}>
                        Tổng số sản phẩm: {products.length}
                    </p>
                </div>

                {/* Form tạo sản phẩm */}
                <div
                    style={{
                        padding: theme.spacing.xl,
                        backgroundColor: theme.colors.bgWhite,
                        borderRadius: theme.borderRadius.xl,
                        marginBottom: theme.spacing.xxl,
                        boxShadow: theme.shadows.lg,
                    }}
                >
                    <h2
                        style={{
                            fontSize: theme.typography.fontSize["2xl"],
                            fontWeight: theme.typography.fontWeight.bold,
                            marginBottom: theme.spacing.lg,
                            color: theme.colors.textPrimary,
                            fontFamily: theme.typography.fontFamily.display,
                        }}
                    >
                        Tạo sản phẩm mới
                    </h2>
                    <ProductForm />
                </div>

                {/* Preview sản phẩm theo từng dịp - Giống trang chính */}
                {Object.entries(productsByOccasion).map(([occasion, occasionProducts]) => {
                    if (occasionProducts.length === 0) return null;
                    return (
                        <div key={occasion} style={{ marginBottom: theme.spacing.xxxl }}>
                            <div style={{ marginBottom: theme.spacing.xl }}>
                                <h2
                                    style={{
                                        fontSize: theme.typography.fontSize["3xl"],
                                        fontWeight: theme.typography.fontWeight.bold,
                                        color: theme.colors.textPrimary,
                                        marginBottom: theme.spacing.sm,
                                        fontFamily: theme.typography.fontFamily.display,
                                    }}
                                >
                                    {occasionLabels[occasion as Occasion]} ({occasionProducts.length})
                                </h2>
                                <p style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.md }}>
                                    {occasionProducts.filter((p) => p.active).length} sản phẩm đang hiển thị
                                </p>
                            </div>

                            {/* Product Grid - Giống trang chính */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                    gap: theme.spacing.lg,
                                }}
                            >
                                {occasionProducts.map((product, index) => (
                                    <div key={product._id} style={{ position: "relative" }}>
                                        {/* Product Card */}
                                        <ProductCard product={product} priority={index < 4} />
                                        
                                        {/* Admin Badge */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: theme.spacing.sm,
                                                right: theme.spacing.sm,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: theme.spacing.xs,
                                                zIndex: 10,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                                    backgroundColor: product.active ? theme.colors.success : theme.colors.error,
                                                    color: theme.colors.textWhite,
                                                    borderRadius: theme.borderRadius.md,
                                                    fontSize: theme.typography.fontSize.xs,
                                                    fontWeight: theme.typography.fontWeight.semibold,
                                                    boxShadow: theme.shadows.md,
                                                }}
                                            >
                                                {product.active ? "✓ Active" : "✗ Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {products.length === 0 && (
                    <div
                        style={{
                            padding: theme.spacing.xxxl,
                            textAlign: "center",
                            backgroundColor: theme.colors.bgWhite,
                            borderRadius: theme.borderRadius.xl,
                            boxShadow: theme.shadows.md,
                        }}
                    >
                        <p style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.lg, margin: 0 }}>
                            Chưa có sản phẩm nào. Hãy tạo sản phẩm đầu tiên!
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
