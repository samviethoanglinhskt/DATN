export interface IVariantImage {
    id?: number;
    url: string;
    name?: string;
  }
  
  export interface IVariant {
    id: number;
    tb_size_id: number;
    tb_color_id: number;
    sku: string;
    price: number;
    quantity: number;
    status: string;
    images: string[];
  }
  
  export interface IProduct {
    id: number;
    name: string;
    image: string;
    tb_category_id: number;
    tb_brand_id: number;
    status: string;
    variants: IVariant[];
  }
  
  export interface IProductDetail extends IProduct {
    description: string;
  }
  
  export interface TableColumnProps {
    categories: any[];
    brands: any[];
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
    handleViewDetail: (id: number) => void;
  }