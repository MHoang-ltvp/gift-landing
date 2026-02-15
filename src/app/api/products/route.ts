import { getDb } from "@/lib/db";

// Public API: chỉ trả về sản phẩm active
export async function GET(req: Request) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/29049bb3-04ca-43bb-9d39-b9306caca048',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/products/route.ts:GET:entry',message:'API GET /api/products called',data:{timestamp:Date.now()},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const { searchParams } = new URL(req.url);
    const occasion = searchParams.get("occasion");

    const db = await getDb();
    const query: any = { active: true };
    
    if (occasion && ["tet", "valentine", "8-3"].includes(occasion)) {
        query.occasion = occasion;
    }

    const products = await db
        .collection("products")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/29049bb3-04ca-43bb-9d39-b9306caca048',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/products/route.ts:GET:after-query',message:'API products fetched',data:{occasion, count:products.length, titles:products.slice(0,3).map((p:any)=>p.title), timestamp:Date.now()},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    const response = Response.json({ products });
    // Disable caching for this API route
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
}

