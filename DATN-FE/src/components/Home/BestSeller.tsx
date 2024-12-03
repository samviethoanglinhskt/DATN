import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import instance from "src/config/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "src/components/css/BestSeller.css";

// Types
import { Product } from "src/types/product";

// Product Component
const NewProduct = () => {
  const INITIAL_VISIBLE_PRODUCTS = 4;
  const [visibleProducts, setVisibleProducts] = useState(
    INITIAL_VISIBLE_PRODUCTS
  );
  const [isExpanded, setIsExpanded] = useState(false);
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
      const response = await instance.get("/api/product-top");
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
        const response = await axiosInstance.get("/api/product-list");
        const data = response.data;

        // Lưu dữ liệu vào localStorage
        saveToLocalStorage("products", data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

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
                  <div className="product-info">
                    <Link to={`/product/${product.id}`} className="product-link">
                      <h5 className="product-title">{product.name}</h5>
                    </Link>
                    <p className="product-price">
                      {product.variants[0]?.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewProduct;
