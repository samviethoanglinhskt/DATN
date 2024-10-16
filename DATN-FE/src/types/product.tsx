export interface IImage {
    id: number;
    tb_variant_id: number;
    name_image: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface IVariant {
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
    images: IImage[];
}

export interface IColor {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface ISize {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface IProduct {
    id: number;
    tb_category_id: number;
    tb_brand_id: number;
    name: string;
    status: string;
    description: string;
    created_at: string;
    updated_at: string;
    variants: IVariant[];
    colors: IColor[];
    sizes: ISize[];
}
