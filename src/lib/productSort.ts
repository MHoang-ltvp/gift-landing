import type { Product } from "@/types";

/**
 * Hàm helper để extract số từ tên sản phẩm (ví dụ: "TÂM TÌNH 3" → 3)
 * @param title - Tên sản phẩm
 * @returns Số tìm được, hoặc 9999 nếu không tìm thấy (để đẩy xuống cuối)
 */
export function extractNumberFromTitle(title: string): number {
    // Tìm số cuối cùng trong tên (có thể là số đơn hoặc số kèm theo ký tự)
    const match = title.match(/(\d+)(?:\s*$|[^\d]*$)/);
    if (match) {
        return parseInt(match[1], 10);
    }
    // Nếu không tìm thấy số, trả về số lớn để đẩy xuống cuối
    return 9999;
}

/**
 * Sắp xếp sản phẩm theo số trong tên (tăng dần 1-2-3-4)
 * @param products - Mảng sản phẩm cần sắp xếp
 * @returns Mảng sản phẩm đã được sắp xếp
 */
export function sortProductsByNumber(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
        const numA = extractNumberFromTitle(a.title);
        const numB = extractNumberFromTitle(b.title);
        return numA - numB;
    });
}

