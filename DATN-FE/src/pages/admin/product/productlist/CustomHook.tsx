import { useState, useEffect } from 'react';
import { message } from 'antd';
import { IProduct, IProductDetail } from './Type';

import { CACHE_KEYS, getCache, CACHE_DURATION } from './CacheUtils';
import { ProductService } from './ProductServie';

export const useProductCacheCleanup = () => {
  useEffect(() => {
    const cleanup = () => {
      Object.values(CACHE_KEYS).forEach(key => {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const { timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > CACHE_DURATION) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    };

    cleanup();
    const interval = setInterval(cleanup, CACHE_DURATION);

    return () => {
      clearInterval(interval);
    };
  }, []);
};

export const useProductList = () => {
  const [products, setProducts] = useState<IProduct[]>(() => {
    return getCache<IProduct[]>(CACHE_KEYS.PRODUCTS) || [];
  });
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
    if (!getCache(CACHE_KEYS.PRODUCTS)) {
      fetchProducts();
    }
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
  const [categories, setCategories] = useState<any[]>(() => 
    getCache(CACHE_KEYS.CATEGORIES) || []
  );
  const [brands, setBrands] = useState<any[]>(() => 
    getCache(CACHE_KEYS.BRANDS) || []
  );
  const [sizes, setSizes] = useState<any[]>(() => 
    getCache(CACHE_KEYS.SIZES) || []
  );
  const [colors, setColors] = useState<any[]>(() => 
    getCache(CACHE_KEYS.COLORS) || []
  );
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
    if (!categories.length || !brands.length || !sizes.length || !colors.length) {
      fetchMasterData();
    }
  }, [categories.length, brands.length, sizes.length, colors.length]);

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