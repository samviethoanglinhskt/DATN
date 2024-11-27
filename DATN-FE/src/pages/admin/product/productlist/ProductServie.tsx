import axiosInstance from "src/config/axiosInstance";
import { IProduct, IProductDetail } from "./Type";
import { CACHE_KEYS, getCache, setCache } from "./CacheUtils";

export class ProductService {
  static async getProducts(): Promise<IProduct[]> {
    try {
      const cachedProducts = getCache<IProduct[]>(CACHE_KEYS.PRODUCTS);
      if (cachedProducts) {
        return cachedProducts;
      }

      const response = await axiosInstance.get("/api/product-list");
      const products = response.data.data;
      setCache(CACHE_KEYS.PRODUCTS, products);
      return products;
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  }

  static async getCategories() {
    try {
      const cachedCategories = getCache(CACHE_KEYS.CATEGORIES);
      if (cachedCategories) return cachedCategories;

      const response = await axiosInstance.get("/api/category");
      setCache(CACHE_KEYS.CATEGORIES, response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  }

  static async getBrands() {
    try {
      const cachedBrands = getCache(CACHE_KEYS.BRANDS);
      if (cachedBrands) return cachedBrands;

      const response = await axiosInstance.get("/api/brand");
      setCache(CACHE_KEYS.BRANDS, response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch brands");
    }
  }

  static async getSizes() {
    try {
      const cachedSizes = getCache(CACHE_KEYS.SIZES);
      if (cachedSizes) return cachedSizes;

      const response = await axiosInstance.get("/api/size");
      setCache(CACHE_KEYS.SIZES, response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch sizes");
    }
  }

  static async getColors() {
    try {
      const cachedColors = getCache(CACHE_KEYS.COLORS);
      if (cachedColors) return cachedColors;

      const response = await axiosInstance.get("/api/color");
      setCache(CACHE_KEYS.COLORS, response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch colors");
    }
  }

  static async getProductDetail(id: number): Promise<IProductDetail> {
    try {
      const cacheKey = `${CACHE_KEYS.PRODUCT_DETAILS}_${id}`;
      const cachedDetail = getCache<IProductDetail>(cacheKey);
      if (cachedDetail) return cachedDetail;

      const response = await axiosInstance.get(`/api/product/${id}`);
      setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch product detail");
    }
  }

  static async deleteProduct(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/api/product/${id}`);
      // Clear related caches
      localStorage.removeItem(CACHE_KEYS.PRODUCTS);
      localStorage.removeItem(`${CACHE_KEYS.PRODUCT_DETAILS}_${id}`);
    } catch (error) {
      throw new Error("Failed to delete product");
    }
  }

  static async updateProduct(id: number, formData: FormData) {
    try {
      const response = await axiosInstance.post(`/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Clear related caches
      localStorage.removeItem(CACHE_KEYS.PRODUCTS);
      localStorage.removeItem(`${CACHE_KEYS.PRODUCT_DETAILS}_${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update product");
    }
  }
}