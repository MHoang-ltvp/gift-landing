import { getDb } from "@/lib/db";
import ProductsTableClient from "./ProductsTableClient";
import type { Product } from "@/types";

async function getProducts() {
    const db = await getDb();
    const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();

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

    return <ProductsTableClient initialProducts={products} />;
}
