// Interface for Image
export interface VariantImage {
    id: number;
    tb_variant_id: number;
    name_image: string;
    created_at: string;
    updated_at: string;
}

// Interface for Product Variant
export interface ProductVariant {
    id: number;
    tb_product_id: number;
    tb_size_id: number | null;
    tb_color_id: number | null;
    sku: string;
    price: number;
    quantity: number;
    status: string;
    created_at: string;
    updated_at: string;
    images: VariantImage[];
}

// Interface for Product
export interface Product {
    id: number;
    tb_category_id: number;
    tb_brand_id: number;
    name: string;
    status: string;
    description: string;
    created_at: string;
    updated_at: string;
    image: string;
    variants: ProductVariant[];
}

// Interface for Favorite Item
export interface Favorite {
    id: number;
    user_id: number;
    tb_product_id: number;
    created_at: string;
    updated_at: string;
    product: Product;
}


export interface FavoriteContextProps {
    favorites: Favorite[];
    loading: boolean;
    error: string | null;
    totalFavorites: number;
    addFavorite: (productId: number) => Promise<void>;
    removeFavorite: (favoriteId: number) => Promise<void>;
    fetchFavorites: () => Promise<void>;
}