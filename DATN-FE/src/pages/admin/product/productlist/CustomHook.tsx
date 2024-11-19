import { useState, useEffect } from 'react';
import { message } from 'antd';
import { IProduct, IProductDetail } from './Type';
import { ProductService } from './ProductServie';


export const useProductList = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getProducts();
      setProducts(data);
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    refetchProducts: fetchProducts
  };
};

export const useProductDetail = () => {
  const [selectedProduct, setSelectedProduct] = useState<IProductDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const fetchProductDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      const data = await ProductService.getProductDetail(id);
      setSelectedProduct(data);
      setDetailModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch product details");
    } finally {
      setDetailLoading(false);
    }
  };

  return {
    selectedProduct,
    detailLoading,
    detailModalVisible,
    setDetailModalVisible,
    fetchProductDetail
  };
};

export const useProductMasterData = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const [categoriesData, brandsData, sizesData, colorsData] = await Promise.all([
        ProductService.getCategories(),
        ProductService.getBrands(),
        ProductService.getSizes(),
        ProductService.getColors()
      ]);

      setCategories(categoriesData);
      setBrands(brandsData);
      setSizes(sizesData);
      setColors(colorsData);
    } catch (error) {
      message.error("Failed to fetch master data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  return {
    categories,
    brands,
    sizes,
    colors,
    loading,
    refetchMasterData: fetchMasterData
  };
};

export const useProductOperations = (refetchProducts: () => Promise<void>) => {
  const handleDelete = async (id: number) => {
    try {
      await ProductService.deleteProduct(id);
      message.success("Product deleted successfully");
      refetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleUpdate = async (id: number, formData: FormData) => {
    try {
      await ProductService.updateProduct(id, formData);
      message.success("Product updated successfully");
      refetchProducts();
    } catch (error) {
      message.error("Failed to update product");
    }
  };

  return {
    handleDelete,
    handleUpdate
  };
};