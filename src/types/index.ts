export type Occasion = "tet" | "valentine" | "8-3";
export type CardOccasion = "newyear" | "valentine" | "womensday";

export type Product = {
    _id?: string;
    title: string;
    price?: number;
    description?: string;
    image?: string;
    images?: string[];
    occasion: Occasion;
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
