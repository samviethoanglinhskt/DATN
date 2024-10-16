interface Product {
    success: boolean;
    data: Datum[];
}

interface Datum {
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
}

interface Size {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    pivot: Pivot2;
}

interface Pivot2 {
    tb_product_id: number;
    tb_size_id: number;
}

interface Color {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    pivot: Pivot;
}

interface Pivot {
    tb_product_id: number;
    tb_color_id: number;
}

interface Variant {
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
}

interface Image {
    id: number;
    tb_variant_id: number;
    name_image: string;
    status: string;
    created_at: string;
    updated_at: string;
}