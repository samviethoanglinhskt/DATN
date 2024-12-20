import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "src/components/css/NewProduct.css";

// Types
import { Product } from "src/types/product";
import axiosInstance from "src/config/axiosInstance";
import { useFavorites } from "src/context/FavoriteProduct";


// Hàm lưu dữ liệu vào localStorage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`${key}_updated_at`, Date.now().toString());
};

// Hàm lấy dữ liệu từ localStorage
const getFromLocalStorage = (key: string, maxAge: number) => {
  const cachedData = localStorage.getItem(key);
  const updatedAt = localStorage.getItem(`${key}_updated_at`);

  if (cachedData && updatedAt) {
    const age = Date.now() - parseInt(updatedAt, 10);
    if (age < maxAge) {
      return JSON.parse(cachedData);
    }
  }
  return null;
};
// Product Component
const BestSeller = () => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const INITIAL_VISIBLE_PRODUCTS = 4;
  const [visibleProducts, setVisibleProducts] = useState(
    INITIAL_VISIBLE_PRODUCTS
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Query products
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products-top"],
    queryFn: async () => {
      // Kiểm tra dữ liệu cache trước
      const cachedProducts = getFromLocalStorage("products-top", 1000 * 60 * 60); // 1 giờ
      if (cachedProducts) {
        return cachedProducts;
      }

      // Gọi API nếu không có cache
      try {
        const response = await axiosInstance.get("/api/product-top");
        const data = response.data;

        // Lưu dữ liệu vào localStorage
        saveToLocalStorage("products-top", data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  const isFavorite = (productId: number) => {
    return favorites.some((fav) => fav.tb_product_id === productId);
  };

  const getFavoriteId = (productId: number) => {
    const favorite = favorites.find((fav) => fav.tb_product_id === productId);
    return favorite?.id; // Lấy id của mục yêu thích
  };

  if (isLoading) return <div className="text-center my-5">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-danger my-5">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );

  const handleToggleProducts = () => {
    if (isExpanded) {
      setVisibleProducts(INITIAL_VISIBLE_PRODUCTS);
      setIsExpanded(false);
    } else {
      setVisibleProducts(products.data.length);
      setIsExpanded(true);
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h3 className="text-center mb-5">Top Sản Phẩm Bán Chạy Nhất</h3>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {products.data.slice(0, visibleProducts).map((product: Product) => (
            <div key={product.id} className="col product-item">
              <div className="card h-100 product-card border-0">
                <div className="position-relative">
                  <div className="product-image-wrapper">
                    <img
                      src={`http://127.0.0.1:8000/storage/${product.image}`}
                      className="card-img-top product-image"
                      alt={product.name}
                    />
                  </div>
                  <button
                    className={`btn wishlist-btn position-absolute top-0 end-0 m-2 ${isFavorite(product.id) ? "text-danger" : ""
                      }`}
                    onClick={() => {
                      if (isFavorite(product.id)) {
                        const favoriteId = getFavoriteId(product.id);
                        if (favoriteId) removeFavorite(favoriteId); // Truyền ID của mục yêu thích
                      } else {
                        addFavorite(product.id);
                      }
                    }}
                  >
                    <i
                      className={
                        isFavorite(product.id)
                          ? "zmdi zmdi-favorite"
                          : "zmdi zmdi-favorite-outline"
                      }
                    ></i>
                  </button>
                </div>
                <div className="card-body text-center">
                  <Link to={`/product/${product.id}`} className="product-link">
                    <h5 className="product-title">{product.name}</h5>
                  </Link>
                  <p className="product-price fw-bold">
                    {product.variants[0]?.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.data.length > INITIAL_VISIBLE_PRODUCTS && (
          <div className="text-center mt-5">
            <button
              className={`btn ${isExpanded ? "btn-outline-danger" : "btn-outline-dark"
                } px-4 py-2`}
              onClick={handleToggleProducts}
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;
