export type Occasion = "tet" | "valentine" | "8-3";
export type CardOccasion = "newyear" | "valentine" | "womensday";

/** Sub-category slug theo từng occasion (dùng cho toggle danh mục) */
export type TetSubCategory = "ma_dao" | "kim_loc" | "khoi_van" | "an_khang";
export type ValentineSubCategory = "thau_hieu" | "tam_tinh" | "tron_ven";
export type WomenDaySubCategory = "vinh_sac" | "xuan_sac" | "moc_sac";

/** Danh sách sub-category theo occasion: dưới mỗi danh mục (Tết, Valentine, 8/3) là các nhóm cố định, mỗi nhóm chứa sản phẩm có subCategory tương ứng */
export const SUB_CATEGORIES_BY_OCCASION: Record<Occasion, { value: string; label: string }[]> = {
    tet: [
        { value: "ma_dao", label: "Mã Đáo" },
        { value: "kim_loc", label: "Kim Lộc" },
        { value: "khoi_van", label: "Khởi Vận" },
        { value: "an_khang", label: "An Khang" },
    ],
    valentine: [
        { value: "thau_hieu", label: "Thấu Hiểu" },
        { value: "tam_tinh", label: "Tâm Tình" },
        { value: "tron_ven", label: "Trọn Vẹn" },
    ],
    "8-3": [
        { value: "vinh_sac", label: "Vĩnh Sắc" },
        { value: "xuan_sac", label: "Xuân Sắc" },
        { value: "moc_sac", label: "Mộc Sắc" },
    ],
};

export type Product = {
    _id?: string;
    title: string;
    price?: number;
    description?: string;
    image?: string;
    images?: string[];
    occasion: Occasion;
    /** Slug sub-category: tet (ma_dao, kim_loc, khoi_van, an_khang), valentine (thau_hieu, tam_tinh, tron_ven), 8-3 (vinh_sac, xuan_sac, moc_sac) */
    subCategory?: string;
    active: boolean;
    createdAt: string;
};

export type Lead = {
    _id?: string;
    name?: string;
    phone?: string;
    email?: string;
    occasion?: Occasion;
    note?: string;
    createdAt: string;
};

export type Card = {
    _id?: string;
    code: string;
    occasion?: CardOccasion;
    payload: {
        toName?: string;
        fromName?: string;
        message?: string;
    };
    personalImageUrl?: string; // URL ảnh cá nhân (ảnh dọc) hiển thị trong thiệp
    qrImageUrl?: string; // URL ảnh QR code từ Canva
    createdAt: string;
};

export type Settings = {
    _id?: string;
    // Contact Information
    contactInfo?: {
        hotline: string;
        email: string;
    };
    // Addresses (Hà Nội)
    addresses?: string[]; // Mỗi string là một địa chỉ, sẽ hiển thị với bullet point
    // Social Media Links
    socialLinks: {
        instagram?: {
            enabled: boolean;
            url: string;
        };
        facebook?: {
            enabled: boolean;
            url: string;
        };
        youtube?: {
            enabled: boolean;
            url: string;
        };
        tiktok?: {
            enabled: boolean;
            url: string;
        };
    };
    // Google Sheets Integration
    googleSheets?: {
        enabled: boolean;
        webhookUrl: string; // Google Apps Script Web App URL
    };
    updatedAt: string;
};
