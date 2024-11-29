import axiosInstance from "src/config/axiosInstance";
import { IProduct, IProductDetail } from "./Type";


export class ProductService {
  static async getProducts(): Promise<IProduct[]> {
    try {
      const response = await axiosInstance.get("/api/product-list");
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  }

  static async getCategories() {
    try {
      const response = await axiosInstance.get("/api/category");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  }

  static async getBrands() {
    try {
      const response = await axiosInstance.get("/api/brand");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch brands");
    }
  }

  static async getSizes() {
    try {
      const response = await axiosInstance.get("/api/size");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch sizes");
    }
  }

  static async getColors() {
    try {
      const response = await axiosInstance.get("/api/color");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch colors");
    }
  }

  static async getProductDetail(id: number): Promise<IProductDetail> {
    try {
      const response = await axiosInstance.get(`/api/product/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch product detail");
    }
  }

  static async deleteProduct(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/api/product/${id}`);
    } catch (error) {
      throw new Error("Failed to delete product");
    }
  }

  static async updateProduct(id: number, formData: FormData) {
    try {
      const response = await axiosInstance.post(`/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to update product");
    }
  }
}