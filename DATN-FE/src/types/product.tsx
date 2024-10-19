export type Image = {
    id: number;
    tb_variant_id: number;
    name_image: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export type Variant = {
    id: number;
    tb_product_id: number;
    tb_size_id: number;
    tb_color_id: number;
    sku: string;
    price: number;
    quantity: number;
    status: string;
    created_at: string;
    updated_at: string;
    images: Image[];
};

export type Pivot = {
    tb_product_id: number;
    tb_color_id?: number;
    tb_size_id?: number;
    price?: number;
};

export type Color = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    pivot: Pivot;
};

export type Size = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    pivot: Pivot;
};

export type Product = {
    id: number;
    tb_category_id: number;
    tb_brand_id: number;
    name: string;
    status: string;
    description: string;
    created_at: string;
    updated_at: string;
    variants: Variant[];
    colors: Color[];
    sizes: Size[];
};