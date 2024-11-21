import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import instance from "src/config/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "src/assets/css/NewProduct.css";

// Types
import { Product } from "src/types/product";

// Product Component
const NewProduct = () => {
  const INITIAL_VISIBLE_PRODUCTS = 4;
  const [visibleProducts, setVisibleProducts] = useState(
    INITIAL_VISIBLE_PRODUCTS
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query products
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await instance.get("/api/product-list");
      return response.data;
    },
  });

  // Add to favorites mutation
  const addToFavoriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      const token = localStorage.getItem("token");
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
      // queryClient.invalidateQueries(["favorites"]);
    },
    onError: (error: any) => {
      message.error(error.message || "Có lỗi xảy ra!");
    },
  });
  
  const handleFavoriteClick = async (
    e: React.MouseEvent,
    productId: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
      navigate("/login");
      return;
    }

    // Gọi mutation thêm sản phẩm vào danh sách yêu thích
    addToFavoriteMutation.mutate(productId);
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
        <h3 className="text-center mb-5">Newest Products</h3>
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
                    className="btn wishlist-btn position-absolute top-0 end-0 m-2"
                    onClick={(e) => handleFavoriteClick(e, product.id)}
                  >
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title product-name">{product.name}</h5>
                  <p className="product-price fw-bold">
                    ${product.variants[0]?.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.data.length > INITIAL_VISIBLE_PRODUCTS && (
          <div className="text-center mt-5">
            <button
              className={`btn ${
                isExpanded ? "btn-outline-danger" : "btn-outline-dark"
              } px-4 py-2`}
              onClick={handleToggleProducts}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewProduct;
