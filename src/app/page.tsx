import LeadForm from "./components/LeadForm";
import { getDb } from "@/lib/db";
import type { Product, Occasion } from "@/types";

async function getProducts(occasion?: Occasion) {
    const db = await getDb();
    const query: any = { active: true };
    if (occasion) {
        query.occasion = occasion;
    }
    const products = await db
        .collection("products")
        .find(query)
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray();
    return products as Product[];
}

export default async function Home() {
    const [tetProducts, valentineProducts, products83] = await Promise.all([
        getProducts("tet"),
        getProducts("valentine"),
        getProducts("8-3"),
    ]);

    const occasionLabels: Record<Occasion, string> = {
        tet: "Tết",
        valentine: "Valentine",
        "8-3": "8/3",
    };

    return (
        <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, marginBottom: 8 }}>Gift Landing</h1>
            <p style={{ color: "#666", marginBottom: 32 }}>Quà tặng cho mọi dịp đặc biệt</p>

            {/* Sản phẩm theo dịp */}
            {[
                { occasion: "tet" as Occasion, products: tetProducts },
                { occasion: "valentine" as Occasion, products: valentineProducts },
                { occasion: "8-3" as Occasion, products: products83 },
            ].map(({ occasion, products }) => (
                products.length > 0 && (
                    <section key={occasion} style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 16 }}>
                            {occasionLabels[occasion]}
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
                            {products.map((p) => (
                                <div
                                    key={p._id}
                                    style={{
                                        padding: 16,
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 8,
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <h3 style={{ margin: "0 0 8px 0", fontSize: 18 }}>{p.title}</h3>
                                    {p.price && (
                                        <p style={{ margin: 0, color: "#d32f2f", fontWeight: 600 }}>
                                            {p.price.toLocaleString("vi-VN")} đ
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )
            ))}

            {/* Form thu thập lead */}
            <section style={{ marginTop: 48, padding: 24, border: "1px solid #e0e0e0", borderRadius: 8, backgroundColor: "#f9f9f9" }}>
                <h2 style={{ fontSize: 24, marginBottom: 16 }}>Để lại thông tin</h2>
                <p style={{ color: "#666", marginBottom: 16 }}>
                    Chúng tôi sẽ liên hệ với bạn sớm nhất có thể!
                </p>
                <LeadForm />
            </section>
        </main>
    );
}
