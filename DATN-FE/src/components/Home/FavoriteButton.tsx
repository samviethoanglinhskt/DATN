import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import instance from "src/config/axiosInstance";

interface FavoriteButtonProps {
  productId: number;
  className?: string;
}

export const FavoriteButton = ({ productId, className }: FavoriteButtonProps) => {
  const navigate = useNavigate();

  const addToFavoriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token not found!");
        throw new Error("Vui lòng đăng nhập trước!");
      }

      console.log("Token:", token);
      const payload = { tb_product_id: productId };
      console.log("Payload:", payload);

      try {
        const response = await instance.post("/api/favorites", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response data:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Lỗi từ server:", error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message || "Thêm vào yêu thích thất bại."
        );
      }
    },
    onSuccess: () => {
      message.success("Đã thêm vào danh sách yêu thích!");
    },
    onError: (error: any) => {
      message.error(error.message || "Có lỗi xảy ra!");
    },
  });

  const handleFavoriteClick = async (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const token = sessionStorage.getItem("token");
    if (!token) {
      message.warning("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
      navigate("/login");
      return;
    }

    addToFavoriteMutation.mutate(productId);
  };

  return (
    <button
      className={`btn wishlist-btn ${className || ''}`}
      onClick={handleFavoriteClick}
    >
      <i className="zmdi zmdi-favorite-outline"></i>
    </button>
  );
};