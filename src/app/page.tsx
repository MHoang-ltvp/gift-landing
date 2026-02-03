import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import ProductSection from "./components/ProductSection";
import LeadForm from "./components/LeadForm";
import Footer from "./components/Footer";
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
    
    // Convert MongoDB documents to plain objects for Client Components
    return products.map((product: any) => ({
        _id: product._id.toString(),
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        images: product.images,
        occasion: product.occasion,
        subCategory: product.subCategory,
        active: product.active,
        createdAt: product.createdAt,
    })) as Product[];
}

export default async function Home() {
    const [tetProducts, valentineProducts, products83] = await Promise.all([
        getProducts("tet"),
        getProducts("valentine"),
        getProducts("8-3"),
    ]);

    // Get all products for search
    const allProducts = await getProducts();

    const occasionLabels: Record<Occasion, string> = {
        tet: "Danh mục Tết",
        valentine: "Danh mục Valentine",
        "8-3": "Quốc tế phụ nữ",
    };

    return (
        <>
            <Header allProducts={allProducts} />
            <HeroBanner />
            
            {/* Product Sections */}
            <ProductSection
                occasion="tet"
                products={tetProducts}
                label={occasionLabels.tet}
            />
            <ProductSection
                occasion="valentine"
                products={valentineProducts}
                label={occasionLabels.valentine}
            />
            <ProductSection
                occasion="8-3"
                products={products83}
                label={occasionLabels["8-3"]}
            />

            {/* Lead Form */}
            <LeadForm />

            {/* Footer */}
            <Footer />
        </>
    );
}
