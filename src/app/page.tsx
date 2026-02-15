import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import ProductSection from "./components/ProductSection";
import LeadForm from "./components/LeadForm";
import Footer from "./components/Footer";
import { getDb } from "@/lib/db";
import type { Product, Occasion } from "@/types";

// Force dynamic rendering to prevent caching on Vercel
export const dynamic = 'force-dynamic';

async function getProducts(occasion?: Occasion) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/29049bb3-04ca-43bb-9d39-b9306caca048',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:getProducts:entry',message:'getProducts called',data:{occasion, timestamp:Date.now()},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/29049bb3-04ca-43bb-9d39-b9306caca048',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:getProducts:after-query',message:'Products fetched from DB',data:{occasion, count:products.length, titles:products.slice(0,3).map((p:any)=>p.title), timestamp:Date.now()},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/29049bb3-04ca-43bb-9d39-b9306caca048',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:Home:entry',message:'Home page rendering',data:{timestamp:Date.now()},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const [tetProducts, valentineProducts, products83] = await Promise.all([
        getProducts("tet"),
        getProducts("valentine"),
        getProducts("8-3"),
    ]);

    // Get all products for search
    const allProducts = await getProducts();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/29049bb3-04ca-43bb-9d39-b9306caca048',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:Home:after-fetch',message:'Products ready for render',data:{tetCount:tetProducts.length, tetTitles:tetProducts.slice(0,3).map(p=>p.title), allCount:allProducts.length, timestamp:Date.now()},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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
