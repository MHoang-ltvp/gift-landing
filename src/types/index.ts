export type Occasion = "tet" | "valentine" | "8-3";

export type Product = {
    _id?: string;
    title: string;
    price?: number;
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
    template: string; // e.g. "tet_01"
    payload: {
        toName?: string;
        fromName?: string;
        message?: string;
    };
    createdAt: string;
};
