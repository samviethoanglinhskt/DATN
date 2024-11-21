import axiosInstance from "src/config/axiosInstance";
import { IProduct } from "./type";


export class ProductService {
  static async updateProduct(
    id: string,
    formData: FormData
  ): Promise<{ product: IProduct }> {
    try {
      const response = await axiosInstance.post(`/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      console.error("Update product error:", error);
      throw new Error(error.response?.data?.error || "Failed to update product");
    }
  }

  static async deleteVariant(variantId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/api/variants/${variantId}`);
    } catch (error) {
      console.error("Delete variant error:", error);
      throw new Error("Failed to delete variant");
    }
  }

  static async validateVariant(
    variantData: any
  ): Promise<{ success: boolean }> {
    try {
      const response = await axiosInstance.post(
        "/api/validate-variant",
        variantData
      );
      return response.data;
    } catch (error) {
      console.error("Validate variant error:", error);
      throw new Error("Failed to validate variant");
    }
  }
}